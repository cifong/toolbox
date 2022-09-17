function createWeekend() {
    const today = new Date();
    const first = today.getDate() - today.getDay();
    const weekShort = ['日', '一', '二', '三', '四', '五', '六'];
    return weekShort.map((v, i) => {
        const curday = new Date(today.setDate(first + i));
        return [
            v, curday.getDate()
        ];
    });
}
export {createWeekend};