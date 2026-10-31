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
        <span className="meal-field-label">Day status</span>
        <span className="meal-status-text">Spent</span>
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
        <span className="meal-field-label">Expenses (NT$)</span>
        <button
            type="button"
            className="money-detail-button"
            onClick={() => setShow(preState => !preState)}
            aria-expanded={show}
        >
            {content || 'NT$ 0'}
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
            <div className="meal-amount-input"><span aria-hidden="true">NT$</span><input id={`meal-amount-${props.day}`} type="number" min="0" step="any" ref={numRef} aria-label={`Expense amount in NT dollars for ${props.dayLabel}`} placeholder="Amount" required /></div>
            <input type="submit" value="Add" />
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
    return <section className="meal-summary-section" aria-label="Meal budget and settlement">
        <h2 className="section-title">Budget and balance</h2>
        <div className="meal-summary">
            <label htmlFor="meal-balance">Current balance (NT$)<input id="meal-balance" type="number" value={config.balance} name="balance" onChange={handConfig}/></label>
            <label htmlFor="meal-budget">Daily budget (NT$)<input id="meal-budget" type="number" value={config.budget} name="budget" onChange={handConfig}/></label>
        </div>
        <div className="meal-settlement">
            <div><span className="meal-field-label">Projected balance after settlement</span><strong>NT$ {newWeekBalance}</strong></div>
            <p>Unused daily budget is added to the current balance; the week’s expense rows will then be cleared.</p>
            <button type="button" onClick={handleSettleAccounts}>Settle week</button>
        </div>
    </section>;
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
            <h1 className="page-title">Meals</h1>
            <p className="page-description">Record each day’s status and expenses in NT dollars.</p>
            <div className="meal-day-header" aria-hidden="true"><span>Date</span><span>Status</span><span>Expenses</span><span>Add expense</span></div>
            <div className="mealswrapper">
                {mealselement}
            </div>
            <MealInfo data={meals} handleMeals={setMeals}/>
        </div>
    );
};
