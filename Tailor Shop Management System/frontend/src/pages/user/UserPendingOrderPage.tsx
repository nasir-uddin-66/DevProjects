import { Link } from "react-router";

const UserPendingOrderPage = () => {
  const orders = [
    {
      id: 1,
      customer: "Ali Mohammad Nasir",
      dressType: "Panjabi",
      measurements: "Length: 40, Chest: 38, Sleeve: 24",
      deliveryMethod: "Home Delivery",
      paymentStatus: "Paid",
      orderStatus: "Processing",
    },
    {
      id: 2,
      customer: "Rahim Uddin",
      dressType: "Shirt",
      measurements: "Chest: 40, Shoulder: 18",
      deliveryMethod: "Pickup",
      paymentStatus: "Due",
      orderStatus: "Pending",
    },
    {
      id: 2,
      customer: "Rahim Uddin",
      dressType: "Shirt",
      measurements: "Chest: 40, Shoulder: 18",
      deliveryMethod: "Pickup",
      paymentStatus: "Due",
      orderStatus: "Pending",
    },
  ];

  const handlePrint = (id: number) => {
    console.log("Print order:", id);
    window.print();
  };

  return (
    <div>
      {/* Top Navbar */}
      <div className="flex items-center md:px-3 h-15 max-w-5xl bg-[#1b1717] border-b-2 border-[#1fb854] mx-auto">
        <Link
          to="/user/dashboard"
          className="btn btn-ghost p-4 btn-xs text-[0.5rem] md:text-[0.6rem] mx-1 text-[#1fb854]"
        >
          <i className="fa-solid fa-arrow-left"></i> BACK TO DASHBOARD
        </Link>
      </div>

      {/* content */}
      <div className="max-w-4xl font-[Lora] text-[#30ce67] font-semibold mx-2 md:mx-auto rounded-b-2xl lg:px-20 py-10 shadow-lg border-b-2 border-[#1fb854] bg-[#282424]">
        <h1 className="text-center">Pending Orders</h1>

        <div className="overflow-x-auto rounded-lg shadow border border-[#1fb854] bg-[#1b1717] mt-5">
          <table className="table table-zebra w-full text-xs text-[#30ce67]">
            <thead className="text-[#1fb854] text-[0.7rem]">
              <tr>
                <th className="border-b border-[#1fb854]">SL</th>
                <th className="border-b border-[#1fb854]">Customer</th>
                <th className="border-b border-[#1fb854]">Dress Type</th>
                <th className="border-b border-[#1fb854]">Measurements</th>
                <th className="border-b border-[#1fb854]">Delivery</th>
                <th className="border-b border-[#1fb854]">Payment</th>
                <th className="border-b border-[#1fb854]">Status</th>
                <th className="border-b border-[#1fb854] text-center">Print</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className="hover:bg-[#282424] transition">
                  <td>{index + 1}</td>
                  <td>{order.customer}</td>
                  <td>{order.dressType}</td>
                  <td>{order.measurements}</td>
                  <td>{order.deliveryMethod}</td>
                  <td
                    className={
                      order.paymentStatus === "Paid"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {order.paymentStatus}
                  </td>
                  <td>{order.orderStatus}</td>

                  <td className="text-center">
                    <button
                      onClick={() => handlePrint(order.id)}
                      className="btn btn-xs border border-[#1fb854] text-[#1fb854] hover:bg-[#1fb854] hover:text-black"
                    >
                      <i className="fa-solid fa-print"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------- */}
    </div>
  );
};

export default UserPendingOrderPage;
