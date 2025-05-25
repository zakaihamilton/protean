import { createState } from "src/Core/Base/State";
import Screen from "src/UI/Screen";
import { useCallback, useEffect, useMemo } from "react";
import { FaCalculator } from "react-icons/fa6";
import Button from "./Calculator/Button";
import styles from "./Calculator.module.scss";

import { PiPlusMinusBold, PiDivide } from "react-icons/pi";
import Resources from "src/Core/UI/Resources";

const resources = {
    TITLE: {
        eng: "Calculator",
        heb: "מחשבון"
    }
};

function useLayout() {
    const calculator = Calculator.State.useState();
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
                label: () => calculator.input === "0" ? "AC" : "C",
                tooltip: () => calculator.input === "0" ? "All Clear" : "Clear"
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
    }, [calculator]);
}

function useCalculatorMethods(calculator) {

    const decimal = useCallback(() => {
        if (!calculator.input.includes('.')) {
            calculator.input = calculator.input + '.';
        }
    }, [calculator]);

    const operation = useCallback(op => {
        if (calculator.input !== '0') {
            calculator.operation = op;
            calculator.previous = calculator.input;
            calculator.input = '0';
        }
    }, [calculator]);

    const percent = useCallback(() => {
        if (calculator.input !== '0') {
            calculator.input = (parseFloat(calculator.input) / 100).toString();
        }
    }, [calculator]);

    const clear = useCallback(() => {
        if (calculator.input === '0') {
            calculator.input = '0';
            calculator.previous = null;
            calculator.operation = null;
        }
        else {
            calculator.input = '0';
        }
    }, [calculator]);

    const plusminus = useCallback(() => {
        if (calculator.input !== '0') {
            calculator.input = (parseFloat(calculator.input) * -1).toString();
        }
    }, [calculator]);

    const equals = useCallback(() => {
        if (calculator.operation !== null && calculator.previous !== null) {
            const num1 = parseFloat(calculator.previous);
            const num2 = parseFloat(calculator.input);
            let result;
            switch (calculator.operation) {
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
            calculator.input = result.toString();
            calculator.previous = null;
            calculator.operation = null;
        }
    }, [calculator]);

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
    const lookup = Resources.useLookup();
    const calculator = Calculator.State.useState();
    const icon = useMemo(() => <FaCalculator />, []);
    const layout = useLayout();
    const methods = useCalculatorMethods(calculator);
    const elements = useMemo(() => {
        const elements = [];
        layout.forEach((row, rowIndex) => {
            let columnIndex = 1;
            row.forEach((item) => {
                const onClick = () => {
                    const value = parseFloat(item.id);
                    const isAction = isNaN(value);
                    if (isAction) {
                        methods[item.id]();
                    }
                    else {
                        const current = parseFloat(calculator.input);
                        calculator.input = (current * 10 + value).toString();
                    }
                };
                elements.push(<Button key={item.id} row={rowIndex + 2} column={columnIndex} onClick={onClick} {...item} />);
                columnIndex += item.width || 1;
            });
        });
        return elements;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layout, calculator, calculator.input]);

    useEffect(() => {
        methods.clear();
    }, [methods]);

    return <Resources resources={resources} lookup={lookup}>
        <Screen.Rect left={400} top={200} width={300} height={400} />
        <Screen.State icon={icon} id="calculator" label={lookup?.TITLE} fixed assetColor="darkblue" />
        <Screen>
            <div className={styles.root}>
                <div className={styles.input}>{calculator.input}</div>
                {elements}
            </div>
        </Screen>
    </Resources>;
}

Calculator.State = createState("ListEditor.State");
