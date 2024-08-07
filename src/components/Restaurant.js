import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";

export default function Restaurant() {
    const [notice, setNotice] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        contactNumber: "",
        openingHours: "",
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });

    useEffect(() => {
        getAllRestaurants();
    }, [pagination.currentPage]);

    const getAllRestaurants = async () => {
        try {
            const response = await axios.get(`https://foodiedelightbackend.onrender.com/api/v1/restaurant/getAllRestaurants?page=${pagination.currentPage}&limit=10`);
            setAllRestaurants(response.data.restaurants);
            setFilteredRestaurants(response.data.restaurants);
            setPagination({
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
            });
        } catch (error) {
            console.error(error);
            alert("Failed to fetch restaurants. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.post(
                "https://foodiedelightbackend.onrender.com/api/v1/restaurant/createRestaurant",
                formDataToSend
            );
            toast.success("Restaurant Created Successfully!");
            setNotice(false);
            setFormData({
                name: "",
                description: "",
                location: "",
                contactNumber: "",
                openingHours: "",
                restaurantImageUrl: null,
            });
            getAllRestaurants();
        } catch (error) {
            console.error(error);
            alert("Failed to create restaurant. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure want to delete Restaurant?"
        );
        if (confirmDelete) {
            try {
                await axios.delete(`https://foodiedelightbackend.onrender.com/api/v1/restaurant/deleteRestaurantById/${id}`);
                toast.success("Restaurant Deleted Successfully!");
                getAllRestaurants();
            } catch (error) {
                console.error(error);
                alert("Failed to delete restaurant. Please try again.");
            }
        }

    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.patch(`https://foodiedelightbackend.onrender.com/api/v1/restaurant/updateRestaurantById/${editId}`, formDataToSend);
            toast.success("Restaurant Update Successfully!");
            setShowEdit(false);
            getAllRestaurants();
        } catch (error) {
            console.error(error);
            alert("Failed to update restaurant. Please try again.");
        }
    };

    useEffect(() => {
        const getData = async () => {
            if (editId) {
                try {
                    const res = await axios.get(`https://foodiedelightbackend.onrender.com/api/v1/restaurant/getRestaurantById/${editId}`);
                    setFormData(res.data.restaurant);
                } catch (error) {
                    console.error(error);
                    alert("Failed to fetch restaurant details. Please try again.");
                }
            }
        };
        getData();
    }, [editId]);

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        const filtered = allRestaurants.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery)
        );
        setFilteredRestaurants(filtered);
    };

    return (
        <>
            <div className="p-4 flex flex-col items-center">
                <Toaster position="top-center" />
                
                <div className="container flex justify-center w-full flex-col border rounded-lg shadow-md p-4">
                    <div className="flex gap-2 p-4 self-end">
                        <button
                            onClick={() => {
                                setNotice(!notice);
                            }}
                            className="bg-blue-400 text-white font-bold p-2 rounded"
                        >
                            Add New Restaurant
                        </button>
                    </div>
                    <div className="bg-white p-4 shadow-md border rounded-md h-[60vh] overflow-x-auto">
                        <div className="flex justify-between mb-4">
                            <div>
                                <label className="p-2">Search:</label>
                                <input
                                    type="text"
                                    className="border p-1 rounded outline-blue-400"
                                    placeholder="search..."
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

                        <table className="w-full text-left">
                            <thead>
                                <tr className="border">
                                    <th className="p-2 border-r">SL No</th>
                                    <th className="p-2 border-r">Name</th>
                                    <th className="p-2 border-r">Description</th>
                                    <th className="p-2 border-r">Location</th>
                                    <th className="p-2 border-r">Contact Number</th>
                                    <th className="p-2 border-r">Opening Hours</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRestaurants.map((restaurant, index) => (
                                    <tr key={restaurant._id} className="border">
                                        <td className="p-2 border-r">{index + 1}</td>
                                        <td className="p-2 border-r">{restaurant.name}</td>
                                        <td className="p-2 border-r">{restaurant.description}</td>
                                        <td className="p-2 border-r">{restaurant.location}</td>
                                        <td className="p-2 border-r">{restaurant.contactNumber}</td>
                                        <td className="p-2 border-r">{restaurant.openingHours}</td>
                                        <td className="p-2">
                                            <div className="w-20">
                                                <div className="flex h-10">
                                                    <button
                                                        className="border p-2 text-blue-500 hover:bg-gray-100 hover:text-blue-800 w-10"
                                                        onClick={() => {
                                                            setEditId(restaurant._id);
                                                            setShowEdit(true);
                                                        }}
                                                    >
                                                        <AiOutlineEdit size={20} />
                                                    </button>
                                                    <button
                                                        className="border p-2 text-blue-500 hover:bg-gray-100 hover:text-blue-800 w-10"
                                                        onClick={() => handleDelete(restaurant._id)}
                                                    >
                                                        <AiOutlineDelete size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end mt-4">
                            <button
                                className={`mx-2 px-4 py-2 border ${pagination.currentPage === 1 ? 'disabled:opacity-50' : ''}`}
                                disabled={pagination.currentPage === 1}
                                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                            >
                                Previous
                            </button>
                            <button className="mx-2 px-4 py-2 border">
                                {pagination.currentPage}
                            </button>
                            <button
                                className={`mx-2 px-4 py-2 border ${pagination.currentPage === pagination.totalPages ? 'disabled:opacity-50' : ''}`}
                                disabled={pagination.currentPage === pagination.totalPages}
                                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {notice && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-opacity-50 bg-gray-800">
                    <div className="w-1/3 mx-auto p-8 bg-white shadow-lg rounded">
                        <div className="font-bold text-xl mb-4">Add New Restaurant</div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Contact Number:</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Opening Hours:</label>
                                <input
                                    type="text"
                                    name="openingHours"
                                    value={formData.openingHours}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setNotice(false)}
                                    className="bg-gray-400 text-white p-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEdit && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-opacity-50 bg-gray-800">
                    <div className="w-1/3 mx-auto p-8 bg-white shadow-lg rounded">
                        <div className="font-bold text-xl mb-4">Edit Restaurant</div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Contact Number:</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Opening Hours:</label>
                                <input
                                    type="text"
                                    name="openingHours"
                                    value={formData.openingHours}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowEdit(false)}
                                    className="bg-gray-400 text-white p-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

