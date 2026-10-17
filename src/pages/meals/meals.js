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
            return preState.map((meal, index) => index === props.day
                ? { ...meal, status: checked }
                : meal);
        });
    };
    return <label className="meal-field meal-status-field">
        <span className="meal-field-label">Spent?</span>
        <input
            type="checkbox"
            className="habit-checkbox"
            checked={props.checked}
            onChange={handleCheckChange}
            aria-label={`Mark ${props.dayLabel} as spent`}
        />
    </label>;
}
function MoneyDetail(props) {
    const [show, setShow] = React.useState(false);
    const content = !show ? props.data.expendDetail.reduce((a, c) => a + c, 0) : props.data.expendDetail.join(' + ');
    return <div className="meal-field">
        <span className="meal-field-label">Spent</span>
        <button
            type="button"
            className="money-detail-button"
            onClick={() => setShow(preState => !preState)}
            aria-expanded={show}
        >
            {content}
        </button>
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
            return res;
        });
    };
    return <div className="meal-field meal-add-field">
        <label className="meal-field-label" htmlFor={`meal-amount-${props.day}`}>Add expense</label>
        <form onSubmit={addMeals}>
            <input id={`meal-amount-${props.day}`} type="number" min="0" step="any" ref={numRef} aria-label={`Expense amount for ${props.dayLabel}`} />
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
    return <div className="meal-summary">
        <label>Balance <input type="number" value={config.balance} name="balance" onChange={handConfig}/></label>
        <label>Budget <input type="number" value={config.budget} name="budget" onChange={handConfig}/></label>
        <div>New week balance: {newWeekBalance}</div>
        <div><button type="button" onClick={handleSettleAccounts}>Settle accounts</button></div>
    </div>;
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
        const dayLabel = `${v[0]} ${v[1]}`;
        return (
            <section className="meal-day" key={`day${day}`} aria-label={dayLabel}>
                <div className="meal-field meal-date-field">
                    <span className="meal-field-label">Day</span>
                    <WeekTitle data={v} />
                </div>
                <CheckBox day={day} dayLabel={dayLabel} checked={meals[day].status} handleMeals={setMeals} />
                <MoneyDetail data={meals[day]} />
                <AddArea day={day} dayLabel={dayLabel} handleMeals={setMeals}/>
            </section>
        );
    });
    return (
        <div className="container">
            <p> Meals </p>
            <div className="mealswrapper">
                {mealselement}
            </div>
            <MealInfo data={meals} handleMeals={setMeals}/>
        </div>
    );
};
