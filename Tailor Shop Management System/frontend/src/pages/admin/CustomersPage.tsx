// Admin CustomersPage - manage customers

import { useState, useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Layout from "../../components/common/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { userService, orderService } from "../../api/services";
import type { User } from "../../types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const users = await userService.getUsers();
      setCustomers(users);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    setDeleting(true);
    try {
      const result = await userService.deleteUser(customerId);
      if (result) {
        toast.success("Customer deleted successfully!");
        setCustomers(customers.filter((c) => c.id !== customerId));
        setDeleteConfirm(null);
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error("Error deleting customer:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout sidebar={<AdminSidebar />}>
      <div className="min-h-screen bg-[#1b1717]">
        {/* Header Section */}
        <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Customer Management
            </h2>
            <p className="text-white opacity-90">
              View and manage all registered customers
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-5 lg:px-0 py-12">
          {loading ? (
            <LoadingSpinner />
          ) : customers.length === 0 ? (
            <EmptyState message="No customers found" />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="table w-full bg-[#282424] border border-[#1fb854] rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-linear-to-r from-[#1fb854] to-[#178a3f] text-white">
                      <th className="text-white">Name</th>
                      <th className="text-white">Email</th>
                      <th className="text-white">Phone</th>
                      <th className="text-white">Address</th>
                      <th className="text-white">Member Since</th>
                      <th className="text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#30ce67]">
                    {customers.map((customer, idx) => (
                      <tr
                        key={customer.id}
                        className={
                          idx % 2 === 0 ? "bg-[#282424]" : "bg-[#1b1717]"
                        }
                      >
                        <td className="font-semibold">{customer.fullName}</td>
                        <td className="text-sm">{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td
                          className="text-sm max-w-xs truncate"
                          title={customer.address}
                        >
                          {customer.address}
                        </td>
                        <td className="text-sm">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                id: customer.id,
                                name: customer.fullName,
                              })
                            }
                            className="btn btn-xs btn-error hover:shadow-lg hover:shadow-red-600"
                          >
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-[#282424] rounded-lg p-4 border border-[#1fb854] space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#54c07a] text-xs font-semibold mb-1">
                          NAME
                        </p>
                        <p className="text-[#30ce67] font-semibold">
                          {customer.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Email
                        </p>
                        <p className="text-[#30ce67]">{customer.email}</p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Phone
                        </p>
                        <p className="text-[#30ce67]">{customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Address
                        </p>
                        <p className="text-[#30ce67]">{customer.address}</p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Member Since
                        </p>
                        <p className="text-[#30ce67]">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          id: customer.id,
                          name: customer.fullName,
                        })
                      }
                      className="btn btn-sm btn-error w-full"
                    >
                      <i className="fa-solid fa-trash"></i> Delete Customer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {customers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#1fb854]">
                <p className="text-[#30ce67] text-sm mb-2">Total Customers</p>
                <p className="text-3xl font-bold text-[#1fb854]">
                  {customers.length}
                </p>
              </div>
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#54c07a]">
                <p className="text-[#30ce67] text-sm mb-2">New This Month</p>
                <p className="text-3xl font-bold text-[#54c07a]">
                  {
                    customers.filter((c) => {
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return new Date(c.createdAt) > monthAgo;
                    }).length
                  }
                </p>
              </div>
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#f59e0b]">
                <p className="text-[#30ce67] text-sm mb-2">Active</p>
                <p className="text-3xl font-bold text-[#f59e0b]">
                  {customers.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#282424] rounded-lg border-2 border-red-600 p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-red-600 text-3xl">
                <i className="fa-solid fa-exclamation-triangle"></i>
              </div>
              <h3 className="text-[#30ce67] text-xl font-bold">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-[#30ce67] mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white">{deleteConfirm.name}</span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="btn btn-outline flex-1 text-[#30ce67] border-[#1fb854] hover:border-[#30ce67]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCustomer(deleteConfirm.id)}
                disabled={deleting}
                className="btn btn-error flex-1"
              >
                {deleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash"></i> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
