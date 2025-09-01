const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];


function Menu() {

    const pizzas = pizzaData
    const pizzaNum = pizzas.length

    return (
        <main className="menu">
            <h2>Our Menu</h2>
            
            {
                pizzaNum > 0 ? (
                    <>
                        <p>Authentic Italian cuisine. 6 creative dishes to choose from. All from our stone oven, all organic, all delicious.</p>
                        <ul className="pizzas">
                            {pizzaData.map((pizza) => {
                                return <Pizza key={pizza.name} pizzaObj={pizza}/>
                            })}
                        </ul>
                    </>
                ) : (
                    <p>We're still working on our menu. Please come back later</p>
                )
            }
            
        </main>
    )
}

function Pizza({pizzaObj}) {

    // if (props.pizzaObj.soldOut) return null
    
    return (
        <li className={`pizza ${pizzaObj.soldOut ? 'sold-out' : ''}`}>
            <img src={pizzaObj.photoName} alt="" />
            <div>
                <h3>{pizzaObj.name}</h3>
                <p>{pizzaObj.ingredients}</p>
                <span>{pizzaObj.soldOut ? "SOLD OUT" : pizzaObj.price + 3}</span>
            </div>
        </li>
    )
}

function Header() {
    const style = {color: 'red', fontSize: '48px', textTransform: "uppercase" }
    return (
        <header className="header">
            <h1 style={style}>Fast React Pizza Co.</h1>
        </header>
    )
}



function Footer () {
    const hour = new Date().getHours()
    const openHour = 20;
    const closeHour = 22;
    const isOpen = hour >= openHour && hour <= closeHour;

    // if (hour >= openHour && hour <=closeHour) alert("We're currently open");
    // else alert("Sorry, we're closed");

    // if (!isOpen) return <p>We're happy to welcome you between {openHour}:00 and {closeHour}:00. </p>

    return (
        <footer className="footer">
            {isOpen ? 
            <Order openHour={openHour} closeHour={closeHour}/> : (
                <p>We're happy to welcome you between {openHour}:00 and {closeHour}:00. </p>
            )}
        </footer>
    )
}

function Order(props) {
    return (
        <div className="order">
            <p>We're open until {props.closeHour}:00. Come visit us or order online. </p>
            <button className="btn">Order</button>
        </div>
    )
}

function App() {
    return (
        <div className="container">
            <Header />
            <Menu />
            <Footer />
        </div>
    )
}


export default App