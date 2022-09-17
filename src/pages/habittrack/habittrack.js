import React from "react";
import { useLocalStorage } from "hooks/customhooks";
import { createWeekend } from "utils/common";
function CheckBox(props) {
    return <div className="habit-item-section"><input
        type="checkbox"
        className="habit-checkbox"
        name={`${props.id}`}
        id={`${props.id}`}
        checked={props.checked}
        onChange={props.handleChange} /></div>;
}
function WeekTitle(props) {
    const [title, day] = props.data;
    return <div className="habit-item-section">
        <div>{title}</div>
        <div>{day}</div>
    </div>;
}
function HabitItemName(props) {
    const detailRef = React.useRef(null);
    const handleClick = (e) => {
        console.log(e, detailRef.current);
        detailRef.current.classList.toggle('active');
    };
    const shortName = props.habitName.split(' ').map(v => v[0]).join('').slice(0, 3);
    return <div className="habit-item-title" onClick={handleClick}>
        {shortName}
        <div className="habit-item-title-detail" ref={detailRef}>{props.habitName}</div>
    </div>;
}
export default function HabitTrack() {
    const [habitlist, setHabitList] = useLocalStorage('habitlist', []);
    const addHabitListItem = (name) => {
        if (!name.length) return;
        setHabitList((preState) => preState.concat(
            {
                name: name,
                list: new Array(7).fill(false)
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
    const handleCheckChange = (e) => {
        const [index, day] = e.target.id.split('-');
        const value = e.target.checked;
        setHabitList((preState) => {
            preState[index].list[day] = value;
            return [...preState];
        });
    };
    console.log(habitlist);
    const habitlistelement = habitlist.map((habit, index) => {
        const res = [];
        res.push(<HabitItemName key={`${index}-${habit.name}`} habitName={habit.name}/>);
        for (let i = 0; i < habit.list.length; i++) {
            const id = `${index}-${i}`;
            res.push(<CheckBox key={id} id={id} checked={habit.list[i]} handleChange={handleCheckChange} />);
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