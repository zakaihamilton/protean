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
            {
                id: "7",
                label: "7"
            },
            {
                id: "8",
                label: "8"
            },
            {
                id: "9",
                label: "9"
            },
            {
                id: "multiply",
                label: "x",
                tooltip: "Multiply"
            }
        ],
        [
            {
                id: "4",
                label: "4"
            },
            {
                id: "5",
                label: "5"
            },
            {
                id: "6",
                label: "6"
            },
            {
                id: "subtract",
                label: "-",
                tooltip: "Subtract"
            }
        ],
        [
            {
                id: "1",
                label: "1"
            },
            {
                id: "2",
                label: "2"
            },
            {
                id: "3",
                label: "3"
            },
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

    const add = useCallback(() => {
        operation('+');
    }, [operation]);

    const subtract = useCallback(() => {
        operation('-');
    }, [operation]);

    const multiply = useCallback(() => {
        operation('*');
    }, [operation]);

    const divide = useCallback(() => {
        operation('/');
    }, [operation]);

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
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
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
            add,
            subtract,
            multiply,
            divide,
            percent,
            equals,
            plusminus
        };
    }, [add, clear, decimal, divide, equals, multiply, percent, plusminus, subtract]);
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
        <Window icon={icon} label="Calculator" fixed accentBackground="darkblue">
            <div className={styles.grid}>
                <div className={styles.input}>{state.input}</div>
                {elements}
            </div>
        </Window>
    </>;
}

Calculator.State = createState("ListEditor.State");
