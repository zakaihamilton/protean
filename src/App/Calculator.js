import { createState } from "src/Core/Base/State";
import Window from "src/UI/Window";
import { useCallback, useEffect, useMemo } from "react";
import { FaCalculator } from "react-icons/fa6";
import Button from "./Calculator/Button";
import styles from "./Calculator.module.scss";

import { PiPlusMinusBold, PiDivide } from "react-icons/pi";

function useLayout() {
    const state = Calculator.State.useState();
    return useMemo(() => {
        const mapNumber = (n) => {
            return {
                id: String(n),
                label: String(n)
            };
        };
        return [[
            {
                id: "clear",
                label: () => state.input === "0" ? "AC" : "C",
                tooltip: () => state.input === "0" ? "All Clear" : "Clear"
            },
            {
                id: "plusminus",
                icon: <PiPlusMinusBold />,
                tooltip: "Negate the displayed value"
            },
            {
                id: "percent",
                label: "%",
                tooltip: "Percentage"
            },
            {
                id: "divide",
                icon: <PiDivide />,
                tooltip: "Divide"
            }
        ],
        [
            ...[7, 8, 9].map(mapNumber),
            {
                id: "multiply",
                label: "x",
                tooltip: "Multiply"
            }
        ],
        [
            ...[4, 5, 6].map(mapNumber),
            {
                id: "subtract",
                label: "-",
                tooltip: "Subtract"
            }
        ],
        [
            ...[1, 2, 3].map(mapNumber),
            {
                id: "add",
                label: "+",
                tooltip: "Add"
            }
        ],
        [
            {
                id: "0",
                label: "0",
                width: 2
            },
            {
                id: "decimal",
                label: "."
            },
            {
                id: "equals",
                label: "=",
                tooltip: "Equals"
            }
        ]]
    }, [state]);
}

function useCalculator(state) {

    const decimal = useCallback(() => {
        if (!state.input.includes('.')) {
            state.input = state.input + '.';
        }
    }, [state]);

    const operation = useCallback(op => {
        if (state.input !== '0') {
            state.operation = op;
            state.previous = state.input;
            state.input = '0';
        }
    }, [state]);

    const percent = useCallback(() => {
        if (state.input !== '0') {
            state.input = (parseFloat(state.input) / 100).toString();
        }
    }, [state]);

    const clear = useCallback(() => {
        if (state.input === '0') {
            state.input = '0';
            state.previous = null;
            state.operation = null;
        }
        else {
            state.input = '0';
        }
    }, [state]);

    const plusminus = useCallback(() => {
        if (state.input !== '0') {
            state.input = (parseFloat(state.input) * -1).toString();
        }
    }, [state]);

    const equals = useCallback(() => {
        if (state.operation !== null && state.previous !== null) {
            const num1 = parseFloat(state.previous);
            const num2 = parseFloat(state.input);
            let result;
            switch (state.operation) {
                case 'add':
                    result = num1 + num2;
                    break;
                case 'subtract':
                    result = num1 - num2;
                    break;
                case 'multiply':
                    result = num1 * num2;
                    break;
                case 'divide':
                    if (num2 === 0) {
                        result = 'Error'; // Handle division by zero
                    } else {
                        result = num1 / num2;
                    }
                    break;
                default:
                    result = 'Error';
            }
            state.input = result.toString();
            state.previous = null;
            state.operation = null;
        }
    }, [state]);

    return useMemo(() => {
        return {
            clear,
            decimal,
            add: () => operation('add'),
            subtract: () => operation('subtract'),
            multiply: () => operation('multiply'),
            divide: () => operation('divide'),
            percent,
            equals,
            plusminus
        };
    }, [clear, decimal, equals, operation, percent, plusminus]);
}

export default function Calculator() {
    const state = Calculator.State.useState();
    const icon = useMemo(() => <FaCalculator />, []);
    const layout = useLayout();
    const calculator = useCalculator(state);
    const elements = useMemo(() => {
        const elements = [];
        layout.forEach((row, rowIndex) => {
            let columnIndex = 1;
            row.forEach((item) => {
                const onClick = () => {
                    const value = parseFloat(item.id);
                    const isAction = isNaN(value);
                    if (isAction) {
                        calculator[item.id]();
                    }
                    else {
                        const current = parseFloat(state.input);
                        state.input = (current * 10 + value).toString();
                    }
                };
                elements.push(<Button key={item.id} row={rowIndex + 2} column={columnIndex} onClick={onClick} {...item} />);
                columnIndex += item.width || 1;
            });
        });
        return elements;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layout, state, state.input]);

    useEffect(() => {
        calculator.clear();
    }, [calculator]);

    return <>
        <Window.Rect left={400} top={200} width={300} height={400} />
        <Window icon={icon} id="calculator" label="Calculator" fixed accentBackground="darkblue">
            <div className={styles.root}>
                <div className={styles.input}>{state.input}</div>
                {elements}
            </div>
        </Window>
    </>;
}

Calculator.State = createState("ListEditor.State");
