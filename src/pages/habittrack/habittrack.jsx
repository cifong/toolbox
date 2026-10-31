import React from "react";
import { useStorage, useAuth} from "hooks/customhooks";
import { createWeekend } from "utils/common";
function CheckBox(props) {
    const handleCheckChange = (e) => {
        const [index, day] = e.target.id.split('-').map(Number);
        const value = e.target.checked;
        props.handleHabitList((preState) => {
            return preState.map((habit, habitIndex) => habitIndex === index
                ? { ...habit, list: value ? habit.list | (1 << day) : habit.list & ~(1 << day) }
                : habit);
        });
        props.onChangeStatus(`${props.habitName} marked ${value ? 'done' : 'not done'} for ${props.dayName} ${props.date}.`);
    };
    return <label className={`habit-item-section habit-check-cell ${props.checked ? 'is-checked' : ''}`}>
        <input
            type="checkbox"
            className="habit-checkbox"
            id={`${props.id}`}
            checked={props.checked}
            onChange={handleCheckChange}
            aria-label={`${props.habitName}, ${props.dayName} ${props.date}: ${props.checked ? 'done' : 'not done'}`}
        />
        <span className="sr-only">{props.checked ? 'Done' : 'Mark done'}</span>
    </label>;
}
function WeekTitle(props) {
    const [title, day] = props.data;
    return <div className="habit-item-section habit-week-title">
        <div>{title}</div>
        <div>{day}</div>
    </div>;
}
function HabitItemName(props) {
    const [config, setConfig] = React.useState({
        detailactive: false,
        editMode: false
    });
    const handleClick = (e) => {
        const target = e.target.closest('[data-act]');
        if (!target) return;
        const act = target.dataset.act;
        switch (act) {
            case 'toggleDetail': {
                setConfig(preState => {
                    return {
                        ...preState,
                        detailactive: !preState.detailactive
                    };
                });
                break;
            }
            case 'toggleEditMode': {
                setConfig(preState => {
                    return {
                        ...preState,
                        editMode: !preState.editMode
                    };
                });
                break;
            }
            case 'deleteItem': {
                props.handleHabitList((preState) => preState.filter((v, i) => v.name !== props.habitname || i !== props.habitIndex))
                break;
            }
            case 'input':
            default:
                return;
        }
    };
    const handleHabitName = (e) => {
        const value = e.target.value;
        props.handleHabitList((preState) => preState.map((habit, index) => index === props.habitIndex
            ? { ...habit, name: value }
            : habit));
    };
    return <div className="habit-item-title" onClick={handleClick} data-act="toggleDetail">
        <span className="habit-name-span">{props.habitname}</span>
        <div className={`habit-item-title-detail ${config.detailactive ? 'active' : ''}`}  >
            <HabitItmeContent habitName={props.habitname} editMode={config.editMode} handleHabitName={handleHabitName} />
        </div>
    </div>;
}
function HabitItmeContent(props) {
    const inputRef = React.useRef(null);
    const editRef = React.useRef(null);
    React.useEffect(() => {
        if (props.editMode)
            inputRef.current.focus();
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        editRef.current.click();
    };
    return <>
        <div className="habit-name-wrapper">
            {props.editMode
                ? <form onSubmit={handleSubmit}><input type="text" aria-label={`Edit ${props.habitName}`} value={props.habitName} onChange={props.handleHabitName} data-act="input" ref={inputRef} /></form>
                : <span className="habit-name-span">{props.habitName}</span>
            }

        </div>
        <div className="habit-function-wrapper">
            <button type="button" className="edit-btn habit-btn" data-act="toggleEditMode" ref={editRef} aria-label={`Edit ${props.habitName}`}></button>
            <button type="button" className="delete-btn habit-btn" data-act="deleteItem" aria-label={`Delete ${props.habitName}`}></button>
        </div>
    </>
}
export default function HabitTrack() {
    const { token } = useAuth();
    const [habitlist, setHabitList] = useStorage(`habitlist${token}`, []);
    const [status, setStatus] = React.useState('');
    const addHabitListItem = (name) => {
        if (!name.trim().length) {
            setStatus('Enter a habit name before adding it.');
            return false;
        }
        setHabitList((preState) => preState.concat(
            {
                name: name.trim(),
                list: 0,
                id: new Date().getTime()
            })
        );
        setStatus(`${name.trim()} added to your habits.`);
        return true;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const element = e.target.elements.Username;
        const username = element.value;
        if (addHabitListItem(username)) element.value = '';
    };
    const datatime = createWeekend();
    const habitlistelement = habitlist.map((habit, index) => {
        const res = [];
        res.push(<HabitItemName key={`name-${habit.id}`} habitIndex={index} habitname={habit.name} handleHabitList={setHabitList} />);
        for (let i = 0; i < 7; i++) {
            const id = `${index}-${i}`;
            const mask = 1 << i;
            const [dayName, date] = datatime[i];
            res.push(<CheckBox key={`list-${habit.id}-${id}`} id={id} habitName={habit.name} dayName={dayName} date={date} checked={Boolean(habit.list & mask)} handleHabitList={setHabitList} onChangeStatus={setStatus} />);
        }
        return res;
    });
    const handleSettleAccounts = () => {
        setHabitList(preState => {
            return preState.map(info => {
                return {
                    ...info,
                    list: 0
                }
            });
        });
        setStatus('This week’s habit checkmarks have been cleared.');
    };
    const weektitle = datatime.map((v, i) => <WeekTitle key={`day-${i}`} data={v} />);
    return (
        <div className="container">
            <h1 className="page-title">Habit Track</h1>
            <p className="page-description">Add a habit, then check the matching day when you complete it.</p>
            <div className="habit-add-wraper">
                <form onSubmit={handleSubmit}>
                    <label className="sr-only" htmlFor="new-habit-name">New habit name</label>
                    <input
                        id="new-habit-name"
                        type="text"
                        name="Username"
                        defaultValue=''
                        aria-label="Habit name"
                        placeholder="Habit name"
                        autoComplete="off"
                        required
                    />
                    <input type="submit" value="Add habit" />
                </form>
            </div>
            <p className="status-message" role="status" aria-live="polite">{status}</p>
            {habitlist.length === 0 && <div className="empty-state"><h2>No habits yet</h2><p>Add a habit above, then check off each day as you complete it.</p></div>}
            {habitlist.length > 0 && <div className="habit-wrapper">
                <div className="habit-item-section habit-corner">Habit</div>
                {weektitle}
                {habitlistelement}
            </div>}
            <div>
                <button type="button" onClick={handleSettleAccounts}>Clear this week</button>
            </div>
        </div>
    );
};
