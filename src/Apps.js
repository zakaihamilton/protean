import dynamic from 'next/dynamic'

const ListEditor = dynamic(() => import('src/App/ListEditor'));
const Calculator = dynamic(() => import('src/App/Calculator'));
const Controls = dynamic(() => import('src/App/Controls'));
const TaskManager = dynamic(() => import('src/App/TaskManager'));
const Logs = dynamic(() => import('src/App/Logs'));
const Login = dynamic(() => import('src/App/Login'));

import { MdOutlineListAlt } from "react-icons/md";
import { FaCalculator } from "react-icons/fa6";
import { MdOutlineWidgets } from "react-icons/md";
import { BiWindows } from "react-icons/bi";
import { VscDebugAltSmall } from "react-icons/vsc";
import { BsFillPersonFill } from "react-icons/bs";

const apps = [
    {
        id: "list-editor",
        label: {
            eng: "List Editor",
            heb: "ערוך רשימה"
        },
        icon: <MdOutlineListAlt />,
        Component: ListEditor
    },
    {
        id: "calculator",
        label: {
            eng: "Calculator",
            heb: "מחשבון"
        },
        icon: <FaCalculator />,
        Component: Calculator
    },
    {
        id: "controls",
        label: {
            eng: "Controls",
            heb: "כלים"
        },
        icon: <MdOutlineWidgets />,
        Component: Controls
    },
    {
        id: "task-manager",
        label: {
            eng: "Task Manager",
            heb: "מנהל משימות"
        },
        icon: <BiWindows />,
        Component: TaskManager
    },
    {
        id: "logs",
        label: {
            eng: "Logs",
            heb: "יומן"
        },
        icon: <VscDebugAltSmall />,
        Component: Logs
    },
    {
        id: "login",
        label: {
            eng: "Login",
            heb: "התחברות"
        },
        icon: <BsFillPersonFill />,
        Component: Login
    }
];

export default apps;