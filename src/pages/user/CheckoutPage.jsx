import { useRecoilState, useRecoilValue } from "recoil";
import CartItem from "../../components/CartItem";
import { cartState, userDataState } from "../../recoil/atoms";
import { cartCalcState, checkoutCartState } from "../../recoil/selector";
import axios from "axios";

const CheckoutPage = () => {
    const [cart, setCart] = useRecoilState(cartState);
    const cartCalc = useRecoilValue(cartCalcState)
    const checkoutCart = useRecoilValue(checkoutCartState)
    const userData = useRecoilValue(userDataState)

    const token = localStorage.getItem('token')

    const handleDelete = (id) => {
        const filteredCart = cart.filter(item => item.product._id !== id)
        setCart(filteredCart);
    }

    const handleCheckOut = () => {
        const checkout = {
            userEmail: userData.email,
            products: checkoutCart
        }
        console.log(checkout);
        axios.post('/orders', checkout, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => {
            if (res.data) setCart([])
        })
            .catch(err => console.log(err))
    }

    return ( cart.length > 0 ?
        <div className="w-11/12 lg:w-9/12 mx-auto mt-5">
            {
                cart.map(cartItem => <CartItem key={cartItem.product._id} handleDelete={handleDelete} cartItem={cartItem} />)
            }
            <div className="grid grid-cols-12 border-t-2 mt-5">
                <div className="col-start-6 col-span-6 md:col-start-9 md:col-span-3 text-lg font-bold tracking-wider space-x-2">
                    <span>Total Cost: </span>
                    <span>${cartCalc}</span>
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={handleCheckOut} className="bg-green-500 text-white hover:bg-green-400 px-8 text-lg py-2">Checkout</button>
            </div>
        </div>
        :
        <h1 className="mt-20 text-center text-red-400 text-lg">You have no item to checkout.</h1>
    );
};

export default CheckoutPage;