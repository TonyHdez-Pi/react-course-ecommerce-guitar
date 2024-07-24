import { useState } from "react";
import { db } from "./data/db";
import "./App.css";
import Header from "./components/Header";
import Guitar from "./components/Guitar";

function App() {
	// eslint-disable-next-line no-unused-vars
	const [data, setData] = useState(db);
	const [cart, setCart] = useState([]);

	function addToCart(item) {
		const itemExist = cart.findIndex((guitar) => item.id === guitar.id);
		if (itemExist < 0) {
			item.quantity = 1;
			setCart([...cart, item]);
		} else {
			const updatedCart = [...cart];
			updatedCart[itemExist].quantity++;
			setCart(updatedCart);
		}
	}

	// siempre que le pases un callback al estado (setCart) sabra que que te refieres a el estado pasado
	// entonces ahi podras trabajar sobre ese estado siempre y cuando no lo mutes, en este caso el filter no muta, sino que te devuelve una copia
	function removeFromCart(id) {
		// toma el estado pasado, le aplica un filtro y guarda en el nuevo estado todos los elementos que cumplan con la condicion
		setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
	}

	return (
		<>
			<Header cart={cart} removeFromCart={removeFromCart} />
			<main className="container-xl mt-5">
				<h2 className="text-center">Nuestra Colección</h2>

				<div className="row mt-5">
					{data.map((guitar) => (
						<Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
					))}
				</div>
			</main>

			<footer className="bg-dark mt-5 py-5">
				<div className="container-xl">
					<p className="text-white text-center fs-4 mt-4 m-md-0">
						GuitarLA - Todos los derechos Reservados
					</p>
				</div>
			</footer>
		</>
	);
}

export default App;
