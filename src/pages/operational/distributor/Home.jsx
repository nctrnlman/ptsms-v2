import DashboardCard from "../../../components/cards/DashboardCard";
import {
  FaUsers,
  FaCalendarDay,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import Layout from "../../../components/layouts/OperasionalLayout";
import DataTable from "../../../components/tables/DataTable";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalAddDistributor from "../../../components/cards/ModalAddDistributor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDate, formatCurrency } from "../../../utils/converter";
import { encryptNumber } from "../../../utils/encryptionUtils";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDistributor, setTotalDistributor] = useState(0);
  const [todayTransaction, setTodayTransaction] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [mostDistributorTransaction, setMostDistributorTransaction] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "no_faktur", headerName: "No Faktur", flex: 1 },
    { field: "distributor_name", headerName: "Distributor name", flex: 1 },
    { field: "payment_method", headerName: "Payment Method", flex: 1 },
    { field: "created_at", headerName: "Created Date", flex: 1 },
    { field: "time_to_payment", headerName: "Time To Payment", flex: 1 },
    { field: "amount", headerName: "Total Amount", flex: 1 },
    { field: "note", headerName: "Note", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-3 ">
          <button
            className=" text-brand-500  hover:text-brand-800 font-bold"
            onClick={() => handleEdit(params.row.transaction_id)}
          >
            Edit
          </button>
          <button
            className=" text-red-500 hover:text-red-800 font-bold "
            onClick={() => handleDelete(params.row.transaction_id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleCreateClick = () => {
    navigate("/operasional/distributor/form");
  };
  const handleDelete = (id) => {
    // Logika untuk menghapus data dengan ID yang diteruskan
    console.log(`Delete data with ID: ${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/operasional/distributor/transaction/detail/${encryptNumber(id)}`);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/transactions/in/list`
      );
      const modifiedData = response.data.data.map((item, index) => ({
        id: index + 1,
        transaction_id: item.transaction_in_id,
        no_faktur: item.no_faktur,
        distributor_name: `${item.distributor_name}-(${item.distributor_code})`,
        payment_method: item.payment_method,
        created_at: formatDate(item.created_at),
        time_to_payment: formatDate(item.time_to_payment),
        amount: formatCurrency(item.amount),
        note: item.note,
        action: item.note,
      }));
      setRows(modifiedData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/distributor/master`
      );
      setTotalDistributor(response.data.data.totalDistributor);
      setMostDistributorTransaction(response.data.data.mostDistributorTransaction);
      setTotalTransaction(response.data.data.totalTransaction);
      setTodayTransaction(response.data.data.todayTransaction);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleCreateDistributor = async (newDistributor) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/distributor/create`,
        {
          distributorName: newDistributor.name,
          distributorCode: newDistributor.code,
        }
      );
      toast.success(response.data.message);
      await fetchData();
      await fetchMasterData();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error creating distributor:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchData();
  }, []);

  return (
    <Layout>
      <main className="flex flex-col gap-4 ">
      <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Operational
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  href="#"
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                  Distributors
                </a>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex justify-between">
          <h1 className="text-3xl pb-3 font-medium">
            Distributors Dashboard Page
          </h1>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleToggleModal}
              className="flex items-center text-brand-500 hover:bg-gray-50 font-bold p-3 border border-gray-500 rounded-full "
            >
              Add Distributor
              <svg
                className="-mr-1 ml-2 h-4 w-4 text-brand-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>

            <button
              onClick={handleCreateClick}
              className="bg-brand-500 flex  items-center hover:bg-brand-800 text-white font-bold p-3 rounded-full"
            >
              Create
              <svg
                className="-mr-1 ml-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0011-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
    
        <div className="flex gap-6 ">
          <DashboardCard
            title="Total Distributor"
            description={totalDistributor}
            icon={FaUsers}
          />
          <DashboardCard
            title="Today Transaction"
            description={todayTransaction}
            icon={FaCalendarDay}
          />
          <DashboardCard
            title="Total Transaction"
            description={totalTransaction}
            icon={FaClipboardList}
          />
          <DashboardCard
            title="Most Frequent Distributor"
            description={mostDistributorTransaction}
            icon={FaUser}
          />
        </div>
        <DataTable rows={rows} columns={columns} loading={loading} />
    
        <ModalAddDistributor
          openModal={openModal}
          setOpenModal={setOpenModal}
          onCreateDistributor={handleCreateDistributor}
        />
      </main>
    </Layout>
    );
    }