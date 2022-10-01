import React from "react";
import { useStorage, useAuth } from "hooks/customhooks";
import { createWeekend } from "utils/common";
const holiday = [0, 6];
function WeekTitle(props) {
    const [title, day] = props.data;
    return <div className="habit-item-section">
        <div>{title}</div>
        <div>{day}</div>
    </div>;
}
function CheckBox(props) {
    const handleCheckChange = (e) => {
        const checked = e.target.checked;
        props.handleMeals((preState) => {
            preState[props.day].status = checked;
            return [...preState];
        });
    };
    return <div className="habit-item-section">
        <input
            type="checkbox"
            className="habit-checkbox"
            checked={props.checked}
            onChange={handleCheckChange}
        />
    </div>;
}
function MoneyDetail(props) {
    const [show, setShow] = React.useState(false);
    const content = !show ? props.data.expendDetail.reduce((a, c) => a + c, 0) : props.data.expendDetail.join(' + ');
    const handleShow = () => {
        setShow(preState => !preState);
    };
    return <div className="flex-col-center" onClick={handleShow}>
        {content}
    </div>;
}
function AddArea(props) {
    const numRef = React.useRef(null);
    const addMeals = (e) => {
        e.preventDefault();
        const cost = +numRef.current.value;
        if(cost === 0) return;
        numRef.current.value = '';
        props.handleMeals(preState => {
            const res = [...preState];
            res[props.day] = {
                ...preState[props.day]
            };
            res[props.day].expendDetail = [...res[props.day].expendDetail, cost];
            console.log(res[props.day], preState[props.day])
            return res;
        });
    };
    return <div>
        <form onSubmit={addMeals}>
            <input type="number" ref={numRef} />
            <input type="submit" value={'add'} />
        </form>
    </div>
}
function MealInfo(props) {
    const { token } = useAuth();
    const [config, setConfig] = useStorage(`mealsConfig${token}`,{
        budget: 200,
        balance: 0
    });
    const remain = props.data.reduce((a, c) => {
        if(c.status) return a;
        return a + config.budget - c.expendDetail.reduce((add, cur) => add + cur, 0);
    }, 0);
    const newWeekBalance = config.balance + remain;
    const handConfig = (e) => {
        const value = +e.target.value;
        const name = e.target.name;
        setConfig(preState => {
            return {
                ...preState,
                [name]: value
            };
        });
    };
    const handleSettleAccounts = () => {
        props.handleMeals(Array.from({ length: 7 }, (_, i) => {
            return {
                status: holiday.includes(i),
                expendDetail: []
            };
        }));
        setConfig(preState => {
            return {
                ...preState,
                balance: newWeekBalance
            };
        });

    };
    return <>
        <div>balance: <input type="number" value={config.balance} name="balance" onChange={handConfig}/></div>
        <div>budget: <input type="number" value={config.budget} name="budget" onChange={handConfig}/></div>
        <div>newWeekBalance: {newWeekBalance}</div>
        <div><button onClick={handleSettleAccounts}>settle accounts</button></div>
    </>;
}
export default function Meals() {
    const { token } = useAuth();
    const [meals, setMeals] = useStorage(`meallist${token}`, Array.from({ length: 7 }, (_, i) => {
        return {
            status: holiday.includes(i),
            expendDetail: []
        };
    }));
    const datatime = createWeekend();
    const mealselement = datatime.map((v, day) => {
        return [
            <WeekTitle key={`day${day}`} data={v} />
            , <CheckBox key={`status${day}`} day={day} checked={meals[day].status} handleMeals={setMeals} />
            , <MoneyDetail key={`sum${day}`} data={meals[day]} />
            , <AddArea key={`add${day}`} day={day} handleMeals={setMeals}/>
        ];
    });
    return (
        <div className="container">
            <p> Meals </p>
            <div className="mealswrapper">
                {mealselement}
            </div>
            <div className="info-wrapper">
                <MealInfo data={meals} handleMeals={setMeals}/>
            </div>
        </div>
    );
};