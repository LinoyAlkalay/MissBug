const { useState } = React
const { Link } = ReactRouterDOM

import { BugPreview } from "./bug-preview.jsx"
import { BugEdit } from "./bug-edit.jsx"

export function BugList({ bugs, onRemoveBug }) {
    const [isModal, setIsModal] = useState(false)

    function openModal() {
        console.log('open modal:')
        return <div className="app-modal">
            <div className="app-modal-content">
                <BugEdit />
            </div>
        </div>
    }

    return <ul className="bug-list">
        {isModal && openModal()}
        {bugs.map(bug =>
            <li className="bug-preview" key={bug._id}>
                <div className="bug-preview-content">
                    <button onClick={() => { onRemoveBug(bug._id) }}
                        className="fa-regular trash-can" title="delete"></button>
                    <button onClick={() => setIsModal(!isModal)}
                        className="fa-regular pen-to-sgure" title="edit">
                    </button>
                    {/* <button onClick={() => { onEditBug(bug) }}
                        className="fa-regular pen-to-sgure" title="edit">
                    </button> */}
                    <BugPreview bug={bug} />
                </div>
                <Link to={`/bug/${bug._id}`} className="fa-solid arrow-rigth">
                    <span>Details</span>
                </Link>
            </li>)}
    </ul>
}