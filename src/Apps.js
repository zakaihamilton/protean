import dynamic from 'next/dynamic';

const ListEditor = dynamic(() => import('src/App/ListEditor'));
const Calculator = dynamic(() => import('src/App/Calculator'));
const Controls = dynamic(() => import('src/App/Controls'));
const TaskManager = dynamic(() => import('src/App/TaskManager'));
const Logs = dynamic(() => import('src/App/Logs'));
const Login = dynamic(() => import('src/App/Login'));

import { BiWindows } from 'react-icons/bi';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaCalculator } from 'react-icons/fa6';
import { MdOutlineListAlt, MdOutlineWidgets } from 'react-icons/md';
import { VscDebugAltSmall } from 'react-icons/vsc';

const apps = [
  {
    id: 'list-editor',
    label: {
      eng: 'List Editor',
      heb: 'ערוך רשימה',
    },
    icon: <MdOutlineListAlt />,
    Component: ListEditor,
  },
  {
    id: 'calculator',
    label: {
      eng: 'Calculator',
      heb: 'מחשבון',
    },
    icon: <FaCalculator />,
    Component: Calculator,
  },
  {
    id: 'controls',
    label: {
      eng: 'Controls',
      heb: 'כלים',
    },
    icon: <MdOutlineWidgets />,
    Component: Controls,
  },
  {
    id: 'task-manager',
    label: {
      eng: 'Task Manager',
      heb: 'מנהל משימות',
    },
    icon: <BiWindows />,
    Component: TaskManager,
  },
  {
    id: 'logs',
    label: {
      eng: 'Logs',
      heb: 'יומן',
    },
    icon: <VscDebugAltSmall />,
    Component: Logs,
  },
  {
    id: 'login',
    label: {
      eng: 'Login',
      heb: 'התחברות',
    },
    icon: <BsFillPersonFill />,
    Component: Login,
  },
];

export default apps;
