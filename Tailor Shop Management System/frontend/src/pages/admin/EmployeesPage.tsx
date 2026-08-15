// Admin EmployeesPage - manage employees

import { useState, useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Layout from "../../components/common/Layout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { employeeService } from "../../api/services";
import type { Employee } from "../../types";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    specialization: "",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const emps = await employeeService.getEmployees();
      setEmployees(emps);
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeService.createEmployee({
        ...formData,
        role: "employee" as const,
      });
      toast.success("Employee added successfully!");
      setShowAddForm(false);
      setFormData({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        address: "",
        specialization: "",
      });
      loadEmployees();
    } catch (error) {
      toast.error("Failed to add employee");
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    setDeleting(true);
    try {
      const result = await employeeService.deleteEmployee(employeeId);
      if (result) {
        toast.success("Employee deleted successfully!");
        setEmployees(employees.filter((e) => e.id !== employeeId));
        setDeleteConfirm(null);
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
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
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Employee Management
                </h2>
                <p className="text-white opacity-90">
                  Manage your team of professional tailors
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn btn-outline border-white text-white hover:bg-white hover:text-[#1fb854] whitespace-nowrap"
              >
                <i className="fa-solid fa-plus"></i>{" "}
                {showAddForm ? "Cancel" : "Add Employee"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-5 lg:px-0 py-12">
          {/* Add Employee Form */}
          {showAddForm && (
            <div className="bg-[#282424] rounded-lg p-6 border border-[#1fb854] mb-8">
              <h3 className="text-[#54c07a] text-lg font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-user-plus"></i> Add New Employee
              </h3>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="input input-bordered bg-[#1b1717] text-[#30ce67] border-[#1fb854] focus:border-[#54c07a]"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered bg-[#1b1717] text-[#30ce67] border-[#1fb854] focus:border-[#54c07a]"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered bg-[#1b1717] text-[#30ce67] border-[#1fb854] focus:border-[#54c07a]"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="input input-bordered bg-[#1b1717] text-[#30ce67] border-[#1fb854] focus:border-[#54c07a]"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="input input-bordered bg-[#1b1717] text-[#30ce67] border-[#1fb854] focus:border-[#54c07a]"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Specialization (optional)"
                    className="input input-bordered bg-[#1b1717] text-[#30ce67] border-[#1fb854] focus:border-[#54c07a]"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-check"></i> Add Employee
                </button>
              </form>
            </div>
          )}

          {/* Employees Display */}
          {loading ? (
            <LoadingSpinner />
          ) : employees.length === 0 ? (
            <EmptyState message="No employees found" />
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
                      <th className="text-white">Specialization</th>
                      <th className="text-white">Joined</th>
                      <th className="text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#30ce67]">
                    {employees.map((employee, idx) => (
                      <tr
                        key={employee.id}
                        className={
                          idx % 2 === 0 ? "bg-[#282424]" : "bg-[#1b1717]"
                        }
                      >
                        <td className="font-semibold">{employee.fullName}</td>
                        <td className="text-sm">{employee.email}</td>
                        <td>{employee.phone}</td>
                        <td className="text-sm">
                          {employee.specialization || "N/A"}
                        </td>
                        <td className="text-sm">
                          {new Date(employee.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                id: employee.id,
                                name: employee.fullName,
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
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-[#282424] rounded-lg p-4 border border-[#1fb854] space-y-3"
                  >
                    <div>
                      <p className="text-[#54c07a] text-xs font-semibold mb-1">
                        NAME
                      </p>
                      <p className="text-[#30ce67] font-semibold">
                        {employee.fullName}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Email
                        </p>
                        <p className="text-[#30ce67]">{employee.email}</p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Phone
                        </p>
                        <p className="text-[#30ce67]">{employee.phone}</p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Specialization
                        </p>
                        <p className="text-[#30ce67]">
                          {employee.specialization || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#1fb854] text-xs font-semibold">
                          Joined
                        </p>
                        <p className="text-[#30ce67]">
                          {new Date(employee.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          id: employee.id,
                          name: employee.fullName,
                        })
                      }
                      className="btn btn-sm btn-error w-full"
                    >
                      <i className="fa-solid fa-trash"></i> Delete Employee
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {employees.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#1fb854]">
                <p className="text-[#30ce67] text-sm mb-2">Total Employees</p>
                <p className="text-3xl font-bold text-[#1fb854]">
                  {employees.length}
                </p>
              </div>
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#54c07a]">
                <p className="text-[#30ce67] text-sm mb-2">Specialized</p>
                <p className="text-3xl font-bold text-[#54c07a]">
                  {employees.filter((e) => e.specialization).length}
                </p>
              </div>
              <div className="bg-linear-to-br from-[#282424] to-[#1b1717] rounded-lg p-6 border border-[#f59e0b]">
                <p className="text-[#30ce67] text-sm mb-2">Active</p>
                <p className="text-3xl font-bold text-[#f59e0b]">
                  {employees.length}
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
                onClick={() => handleDeleteEmployee(deleteConfirm.id)}
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
