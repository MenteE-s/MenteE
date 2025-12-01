import React, { useState, useEffect } from "react";
import { Lock, Shield, CreditCard, HelpCircle, Mail } from "lucide-react";

const AccountSettings = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("security");
  const [saveMessage, setSaveMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  });

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSaveMessage("Passwords don't match!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    // Simulate password change
    setSaveMessage("Password changed successfully!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePrivacySubmit = (e) => {
    e.preventDefault();
    // Simulate saving privacy settings
    setSaveMessage("Privacy settings updated!");

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-slate-600">
            Manage your profile, security, and preferences
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success">
            {saveMessage}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === "security"
                      ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600 border border-primary-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Lock className="h-5 w-5 mr-3" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === "privacy"
                      ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600 border border-primary-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Privacy
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === "billing"
                      ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600 border border-primary-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Billing
                </button>
                <button
                  onClick={() => setActiveTab("help")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === "help"
                      ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600 border border-primary-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Help & Support
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Security Settings
                </h2>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:shadow-glow transition-all"
                    >
                      <Lock className="h-4 w-4 inline mr-2" />
                      Update Password
                    </button>
                  </div>
                </form>

                <div className="mt-12 pt-8 border-t border-primary-100">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Add an extra layer of security to your account by enabling
                    two-factor authentication.
                  </p>
                  <button className="px-4 py-2 bg-white text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-all">
                    Enable Two-Factor Authentication
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Privacy Settings
                </h2>

                <form onSubmit={handlePrivacySubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium text-slate-900 mb-3">
                        Profile Visibility
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="visibility"
                            value="public"
                            checked={
                              privacySettings.profileVisibility === "public"
                            }
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                profileVisibility: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <span className="ml-3">
                            <span className="block text-sm font-medium text-slate-900">
                              Public
                            </span>
                            <span className="block text-sm text-slate-500">
                              Anyone can view your profile
                            </span>
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="visibility"
                            value="private"
                            checked={
                              privacySettings.profileVisibility === "private"
                            }
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                profileVisibility: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <span className="ml-3">
                            <span className="block text-sm font-medium text-slate-900">
                              Private
                            </span>
                            <span className="block text-sm text-slate-500">
                              Only logged-in users can view your profile
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-primary-100">
                      <h3 className="text-base font-medium text-slate-900 mb-3">
                        Contact Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">
                              Show Email
                            </h4>
                            <p className="text-sm text-slate-500">
                              Display your email address on your profile
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.showEmail}
                              onChange={(e) =>
                                setPrivacySettings({
                                  ...privacySettings,
                                  showEmail: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-accent-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">
                              Show Phone
                            </h4>
                            <p className="text-sm text-slate-500">
                              Display your phone number on your profile
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.showPhone}
                              onChange={(e) =>
                                setPrivacySettings({
                                  ...privacySettings,
                                  showPhone: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-accent-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-primary-100">
                      <h3 className="text-base font-medium text-slate-900 mb-3">
                        Communication
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">
                            Allow Messages
                          </h4>
                          <p className="text-sm text-slate-500">
                            Let other users send you messages
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.allowMessages}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                allowMessages: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-accent-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:shadow-glow transition-all"
                    >
                      <Shield className="h-4 w-4 inline mr-2" />
                      Save Privacy Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Billing & Subscription
                </h2>

                <div className="mb-8">
                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6 border border-primary-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        Current Plan
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-full">
                        Premium
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">
                      $29
                      <span className="text-lg font-normal text-slate-600">
                        /month
                      </span>
                    </p>
                    <p className="text-sm text-slate-600 mb-4">
                      Billed monthly
                    </p>
                    <p className="text-sm text-slate-600">
                      Your next billing date is December 10, 2023
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">
                    Payment Method
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center mr-4">
                        <CreditCard className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Visa ending in 4242
                        </p>
                        <p className="text-sm text-slate-500">Expires 12/24</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-800">
                      Update
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">
                    Billing History
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Nov 10, 2023
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Premium Plan
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            $29.00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Oct 10, 2023
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Premium Plan
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            $29.00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button className="px-4 py-2 bg-white text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-all">
                    Cancel Subscription
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:shadow-glow transition-all">
                    Change Plan
                  </button>
                </div>
              </div>
            )}

            {/* Help & Support Tab */}
            {activeTab === "help" && (
              <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Help & Support
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6 border border-primary-100">
                    <HelpCircle className="h-8 w-8 text-primary-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Help Center
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Browse our comprehensive help articles and tutorials to
                      find answers to common questions.
                    </p>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-800">
                      Visit Help Center →
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg p-6 border border-primary-100">
                    <Mail className="h-8 w-8 text-accent-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Contact Support
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Can't find what you're looking for? Get in touch with our
                      support team.
                    </p>
                    <button className="text-sm font-medium text-accent-600 hover:text-accent-800">
                      Contact Support →
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    <div className="border border-primary-100 rounded-lg p-4">
                      <h4 className="text-base font-medium text-slate-900 mb-2">
                        How do I upgrade my account?
                      </h4>
                      <p className="text-sm text-slate-600">
                        You can upgrade your account by going to the Billing tab
                        in your account settings and selecting the plan that
                        best suits your needs.
                      </p>
                    </div>

                    <div className="border border-primary-100 rounded-lg p-4">
                      <h4 className="text-base font-medium text-slate-900 mb-2">
                        How can I delete my account?
                      </h4>
                      <p className="text-sm text-slate-600">
                        To delete your account, please contact our support team.
                        They will guide you through the process and ensure your
                        data is permanently removed.
                      </p>
                    </div>

                    <div className="border border-primary-100 rounded-lg p-4">
                      <h4 className="text-base font-medium text-slate-900 mb-2">
                        Is my data secure?
                      </h4>
                      <p className="text-sm text-slate-600">
                        Yes, we take data security very seriously. All data is
                        encrypted both in transit and at rest, and we follow
                        industry best practices to keep your information safe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
