import { useEffect, useState, useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {
	// funcion para checar si tenemos algo en local storage y si si,
	// ponerlo en el carrito, asi no perdemos esa informacion.
	const initial = () => {
		const savedCart = localStorage.getItem("cart");
		return savedCart ? JSON.parse(savedCart) : [];
	};
	// eslint-disable-next-line no-unused-vars
	const [data, setData] = useState(db);
	const [cart, setCart] = useState(initial);

	const MAX_ITEMS = 8;
	const MIN_ITEMS = 1;

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	function addToCart(item) {
		const itemExist = cart.findIndex((guitar) => item.id === guitar.id);
		if (itemExist < 0) {
			item.quantity = 1;
			setCart([...cart, item]);
		} else {
			if (cart[itemExist].quantity >= MAX_ITEMS) return;
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

	function increaseQuantity(id) {
		const updatedCart = cart.map((item) => {
			if (item.id === id && item.quantity < MAX_ITEMS) {
				return {
					...item,
					quantity: item.quantity + 1,
				};
			}
			return item;
		});
		setCart(updatedCart);
	}

	function decreseQuantity(id) {
		const updatedCart = cart.map((item) => {
			if (item.id === id && item.quantity > MIN_ITEMS) {
				return {
					...item,
					quantity: item.quantity - 1,
				};
			}
			return item;
		});
		setCart(updatedCart);
	}

	function clearCart() {
		setCart([]);
	}

	// state derivado, sirve simplemente para sacar la logica
	// de dentro del componente y dejarla mas arriba, donde debe de ir
	// aqui usamos useMemo para evitar andar haciendo calculos
	// cada vez que se renderice el componente.
	const isEmpty = useMemo(() => cart.length === 0, [cart]);
	const cartTotal = useMemo(
		() => cart.reduce((total, item) => total + item.quantity * item.price, 0),
		[cart]
	);
	return {
		data,
		cart,
		addToCart,
		removeFromCart,
		increaseQuantity,
		decreseQuantity,
		clearCart,
		isEmpty,
		cartTotal,
	};
};
