const { NavLink } = ReactRouterDOM

import { UserMsg } from './user-msg.jsx'

export function AppHeader() {
    return <header className="main-layout">
        <UserMsg />
        <div className="main-header">
            <h1>Bugs are Forever</h1>
            <nav>
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
        </div >
    </header>
}
