import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import Chat from './pages/Chat';
import Quizzes from './pages/Quizzes';
import Progress from './pages/Progress';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Topics": Topics,
    "Chat": Chat,
    "Quizzes": Quizzes,
    "Progress": Progress,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};