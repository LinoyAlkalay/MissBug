const { useState } = React
const { Link } = ReactRouterDOM

export function AppModal() {
    const [isModal, setIsModal] = useState(false)

    function openModal() {
        return <div className="modal">
            <div className="modal-content">
                <Link to="/"><img src="assets/img/home.png" alt="" /></Link>
                <Link to="/about"><img src="assets/img/info.png" alt="" /></Link>
                <Link to="/mail"><img src="assets/img/gmail.png" alt="" /></Link>
                <Link to="/note"><img src="assets/img/keeps.png" alt="" /></Link>
                <Link to="/book"><img src="assets/img/books.png" alt="" /></Link>
            </div>
        </div>
    }

    return <section className="main-nav">
        <div className="appsus-nav">
            <button className="fa-solid fa-bars menu-toggle-btn"
                onClick={() => document.body.classList.toggle('menu-open')}></button>
            <h1 className="mail-logo">AppSus</h1>
        </div>
        <button onClick={() => setIsModal(!isModal)} className="fa-solid fa-grip-vertical"></button>
        {isModal && openModal()}
    </section>
}