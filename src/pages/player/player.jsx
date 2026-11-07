import React from "react";
import { Link } from "react-router-dom";
import { useAuth, useStorage } from "hooks/customhooks";

const emptySettings = { apiKey: "", folderId: "" };

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function isVideoFile(file) {
    return file.mimeType === "video/mp4" || /\.mp4$/i.test(file.name);
}

export default function Player() {
    const { token } = useAuth();
    const [settings] = useStorage(`drivePlayerSettings-${token}`, emptySettings);
    const [mediaFiles, setMediaFiles] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(-1);
    const [mediaType, setMediaType] = React.useState("");
    const [playMode, setPlayMode] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [playlistLoadFailed, setPlaylistLoadFailed] = React.useState(false);
    const [error, setError] = React.useState("");
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const audioRef = React.useRef(null);
    const videoRef = React.useRef(null);
    const currentMediaRef = React.useRef(null);
    const mediaSessionHandlersRef = React.useRef({});

    const loadPlaylist = React.useCallback(async (apiKey, folderId) => {
        setIsLoading(true);
        setPlaylistLoadFailed(false);
        setError("");
        setMediaFiles([]);
        setCurrentIndex(-1);
        setMediaType("");
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
        [audioRef.current, videoRef.current].forEach(media => {
            if (media) {
                media.pause();
                media.removeAttribute("src");
                media.load();
            }
        });
        currentMediaRef.current = null;

        try {
            const files = [];
            let pageToken = "";
            do {
                const params = new URLSearchParams({
                    q: `'${folderId.replaceAll("'", "\\'")}' in parents and trashed=false`,
                    fields: "nextPageToken,files(id,name,mimeType)",
                    pageSize: "1000",
                    orderBy: "name",
                    key: apiKey
                });
                if (pageToken) params.set("pageToken", pageToken);

                const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
                const data = await response.json();
                if (!response.ok || data.error) {
                    throw new Error(data.error?.message || "無法讀取 Google Drive 資料夾。");
                }
                files.push(...(data.files || []));
                pageToken = data.nextPageToken || "";
            } while (pageToken);

            const playableFiles = files.filter(file =>
                /\.(mp3|mp4)$/i.test(file.name)
                    || file.mimeType === "audio/mpeg"
                    || file.mimeType === "video/mp4"
            );
            setMediaFiles(playableFiles);
            if (playableFiles.length === 0) {
                setError("資料夾中找不到 MP3 或 MP4 檔案。");
            }
        } catch (loadError) {
            setPlaylistLoadFailed(true);
            setError(`載入失敗：${loadError.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        if (settings.apiKey && settings.folderId) {
            loadPlaylist(settings.apiKey, settings.folderId);
        }
        // Load the saved configuration once when the page opens.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => () => {
        [audioRef.current, videoRef.current].forEach(media => media?.pause());
    }, []);

    const playMedia = React.useCallback(async (index) => {
        if (index < 0 || index >= mediaFiles.length) return;
        const file = mediaFiles[index];
        const nextType = isVideoFile(file) ? "video" : "audio";
        const nextMedia = nextType === "video" ? videoRef.current : audioRef.current;
        if (!nextMedia) return;

        const previousMedia = currentMediaRef.current;
        if (previousMedia && previousMedia !== nextMedia) {
            previousMedia.pause();
            previousMedia.removeAttribute("src");
            previousMedia.load();
        }
        currentMediaRef.current = nextMedia;
        setCurrentIndex(index);
        setMediaType(nextType);
        setError("");
        setCurrentTime(0);
        setDuration(0);

        const params = new URLSearchParams({ alt: "media", key: settings.apiKey });
        nextMedia.src = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?${params}`;
        try {
            await nextMedia.play();
        } catch {
            setError("無法播放此檔案。請確認檔案可公開讀取，且瀏覽器支援此媒體格式。");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaFiles, settings.apiKey]);

    function playNext(forceNext = false) {
        if (mediaFiles.length === 0) return;
        if (!forceNext && playMode === 1 && currentIndex >= 0) {
            const media = currentMediaRef.current;
            if (media) {
                media.currentTime = 0;
                media.play().catch(() => setError("無法重新播放此檔案。"));
            }
            return;
        }
        let nextIndex = currentIndex + 1;
        if (playMode === 2) {
            nextIndex = Math.floor(Math.random() * mediaFiles.length);
        } else if (nextIndex >= mediaFiles.length) {
            nextIndex = 0;
        }
        playMedia(nextIndex);
    }

    function playPrev() {
        const media = currentMediaRef.current;
        if (!mediaFiles.length) return;
        if (media && media.currentTime > 3) {
            media.currentTime = 0;
            return;
        }
        playMedia(currentIndex <= 0 ? mediaFiles.length - 1 : currentIndex - 1);
    }

    const modeLabels = ["🔁", "🔂", "🔀"];
    const selectedFile = mediaFiles[currentIndex];

    mediaSessionHandlersRef.current = {
        play: () => currentMediaRef.current?.play(),
        pause: () => currentMediaRef.current?.pause(),
        previoustrack: playPrev,
        nexttrack: () => playNext(true)
    };

    React.useEffect(() => {
        if (!selectedFile || !("mediaSession" in navigator) || !("MediaMetadata" in window)) return;
        navigator.mediaSession.metadata = new window.MediaMetadata({
            title: selectedFile.name,
            artist: "隨身雲端播放器"
        });
        ["play", "pause", "previoustrack", "nexttrack"].forEach(action => {
            try {
                navigator.mediaSession.setActionHandler(action, () => mediaSessionHandlersRef.current[action]?.());
            } catch { /* The current browser does not support this action. */ }
        });
    }, [selectedFile?.id]);

    function togglePlay() {
        const media = currentMediaRef.current;
        if (!media) return;
        if (media.paused) media.play().catch(() => setError("無法播放此檔案。"));
        else media.pause();
    }

    function handleEnded() {
        if (currentMediaRef.current) playNext(false);
    }

    return (
        <section className="container drive-player">
            <h1 className="page-title">隨身雲端播放器</h1>
            <p className="page-description">載入 Google Drive 資料夾中的 MP3 與 MP4 檔案。</p>

            {(!settings.apiKey || !settings.folderId) && !isLoading && (
                <div className="empty-state">
                    <h2>尚未設定 Google Drive</h2>
                    <p>請先在設定頁填入 API Key 與資料夾 ID，再載入播放清單。</p>
                    <Link to="/settings">前往設定</Link>
                </div>
            )}

            {error && <p className="drive-player-message" role="alert">{error}</p>}
            {playlistLoadFailed && <Link className="drive-player-edit" to="/settings">編輯 Drive 設定</Link>}
            {isLoading && <p className="drive-player-message" role="status">正在載入播放清單…</p>}

            <div className={`drive-player-video${mediaType === "video" ? " is-visible" : ""}`}>
                <video
                    ref={videoRef}
                    controls
                    playsInline
                    onTimeUpdate={event => { if (event.currentTarget === currentMediaRef.current) setCurrentTime(event.currentTarget.currentTime); }}
                    onLoadedMetadata={event => { if (event.currentTarget === currentMediaRef.current) setDuration(event.currentTarget.duration); }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={handleEnded}
                    onError={() => { if (currentMediaRef.current === videoRef.current) setError("影片載入失敗，請確認分享權限或檔案格式。"); }}
                />
            </div>
            <audio
                ref={audioRef}
                className="drive-player-audio"
                onTimeUpdate={event => { if (event.currentTarget === currentMediaRef.current) setCurrentTime(event.currentTarget.currentTime); }}
                onLoadedMetadata={event => { if (event.currentTarget === currentMediaRef.current) setDuration(event.currentTarget.duration); }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleEnded}
                onError={() => { if (currentMediaRef.current === audioRef.current) setError("音訊載入失敗，請確認分享權限或檔案格式。"); }}
            />

            {settings.apiKey && settings.folderId && mediaFiles.length === 0 && !isLoading && !error && (
                <div className="empty-state"><h2>尚無播放清單</h2><p>目前設定的資料夾中沒有 MP3 或 MP4 檔案。</p></div>
            )}
            {mediaFiles.length > 0 && (
                <ul className="drive-player-playlist" aria-label="播放清單">
                    {mediaFiles.map((file, index) => (
                        <li key={file.id}>
                            <button type="button" className={`drive-player-track${index === currentIndex ? " is-active" : ""}`} onClick={() => playMedia(index)}>
                                <span aria-hidden="true">{isVideoFile(file) ? "🎬" : "🎵"}</span>
                                <span>{file.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {mediaFiles.length > 0 && (
                <div className="drive-player-bar" aria-label="播放器控制">
                    <div className="drive-player-controls">
                        <span className={`drive-player-disc${isPlaying && mediaType === "audio" ? " is-playing" : ""}`} aria-hidden="true">{mediaType === "video" ? "🎬" : "♫"}</span>
                        <div className="drive-player-track-info">
                            <strong title={selectedFile?.name}>{selectedFile?.name || "尚未選擇曲目"}</strong>
                            <span>{isPlaying ? "播放中" : selectedFile ? "已暫停" : "準備就緒"}</span>
                        </div>
                        <button type="button" className="drive-player-icon-button" aria-label="切換播放模式" title="切換播放模式" onClick={() => setPlayMode(mode => (mode + 1) % 3)}>{modeLabels[playMode]}</button>
                        <button type="button" className="drive-player-icon-button" aria-label="上一首" onClick={playPrev}>⏮</button>
                        <button type="button" className="drive-player-icon-button drive-player-play-button" aria-label={isPlaying ? "暫停" : "播放"} onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
                        <button type="button" className="drive-player-icon-button" aria-label="下一首" onClick={() => playNext(true)}>⏭</button>
                    </div>
                    <div className="drive-player-seek">
                        <span>{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            step="1"
                            value={Math.min(currentTime, duration || 0)}
                            aria-label="播放進度"
                            onChange={event => {
                                const media = currentMediaRef.current;
                                if (media) {
                                    media.currentTime = Number(event.target.value);
                                    setCurrentTime(media.currentTime);
                                }
                            }}
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            )}
        </section>
    );
}
