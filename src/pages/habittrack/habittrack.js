import React from "react";
import { useLocalStorage } from "hooks/customhooks";
import { createWeekend } from "utils/common";
function CheckBox(props) {
    const handleCheckChange = (e) => {
        const [index, day] = e.target.id.split('-');
        const value = e.target.checked;
        props.handleHabitList((preState) => {
            preState[index].list[day] = value;
            return [...preState];
        });
    };
    return <div className="habit-item-section">
        <input
            type="checkbox"
            className="habit-checkbox"
            name={`${props.id}`}
            id={`${props.id}`}
            checked={props.checked}
            onChange={handleCheckChange}
        />
    </div>;
}
function WeekTitle(props) {
    const [title, day] = props.data;
    return <div className="habit-item-section">
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
        props.handleHabitList((preState) => {
            preState[props.habitIndex].name = value;
            return [...preState];
        });
    };
    const shortName = props.habitname.split(' ').map(v => v[0]).join('').slice(0, 3);
    return <div className="habit-item-title" onClick={handleClick} data-act="toggleDetail">
        {shortName}
        <div className={`habit-item-title-detail ${config.detailactive ? 'active' : ''}`}  >
            <HabitItmeContent habitName={props.habitname} editMode={config.editMode} handleHabitName={handleHabitName} />
        </div>
    </div>;
}
function HabitItmeContent(props) {
    const inputRef = React.useRef(null);
    React.useEffect(() => {
        if (props.editMode)
            inputRef.current.focus();
    });
    return <>
        <div className="habit-name-wrapper">
            {props.editMode
                ? <input type="text" value={props.habitName} onChange={props.handleHabitName}  data-act="input" ref={inputRef} />
                : <span className="habit-name-span">{props.habitName}</span>
            }

        </div>
        <div className="habit-function-wrapper">
            <button className="edit-btn habit-btn" data-act="toggleEditMode"></button>
            <button className="delete-btn habit-btn" data-act="deleteItem"></button>
        </div>
    </>
}
export default function HabitTrack() {
    const [habitlist, setHabitList] = useLocalStorage('habitlist', []);
    const addHabitListItem = (name) => {
        if (!name.length) return;
        setHabitList((preState) => preState.concat(
            {
                name: name,
                list: new Array(7).fill(false),
                id: new Date().getTime()
            })
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const element = e.target.elements.Username;
        const username = element.value;
        element.value = '';
        addHabitListItem(username);
    };
    const habitlistelement = habitlist.map((habit, index) => {
        const res = [];
        res.push(<HabitItemName key={`name-${habit.id}`} habitIndex={index} habitname={habit.name} handleHabitList={setHabitList} />);
        for (let i = 0; i < habit.list.length; i++) {
            const id = `${index}-${i}`;
            res.push(<CheckBox key={`list-${habit.id}-${id}`} id={id} checked={habit.list[i]} handleHabitList={setHabitList} />);
        }
        return res;
    });
    const datatime = createWeekend();
    const weektitle = datatime.map((v, i) => <WeekTitle key={`day-${i}`} data={v} />);
    return (
        <div className="container">
            <p> HabitTrack </p>
            <div className="habit-add-wraper">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="Username"
                        defaultValue=''
                        autoComplete="off"
                        required
                    />
                    <input type="submit" value="add" />
                </form>
            </div>
            <div className="habit-wrapper">
                <div></div>
                {weektitle}
                {habitlistelement}
            </div>
        </div>
    );
};