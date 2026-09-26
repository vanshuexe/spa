import React, { useState } from 'react';
import { AppointmentItem, TherapistProfile } from '../types';
import { THERAPISTS_DATA, SPA_PHONE } from '../data/siteData';

interface AppointmentManagementViewProps {
  confirmedAppointments?: AppointmentItem[];
  pendingAppointments?: AppointmentItem[];
  rejectedAppointments?: AppointmentItem[];
  onShowAlert: (title: string, message: string) => void;
  onNavigateToBooking?: () => void;
}

export const AppointmentManagementView: React.FC<AppointmentManagementViewProps> = ({
  confirmedAppointments: initialConfirmed = [],
  pendingAppointments: initialPending = [
    {
      id: 'p-1',
      srNo: 1,
      therapistName: 'Mary',
      therapistId: 'mary',
      clientName: 'Anand Kumar',
      date: '2026-09-27',
      time: '11:00 AM',
      address: 'Prestige Lavender Fields',
      flatNumber: '402',
      floorNumber: '4th Floor',
      streetName: 'Varthur Main Road',
      crossStreetName: 'Near Forum Value Mall',
      locality: 'Whitefield',
      amount: '₹2,100',
      status: 'pending',
    },
    {
      id: 'p-2',
      srNo: 2,
      therapistName: 'Pari',
      therapistId: 'pari',
      clientName: 'Siddharth V',
      date: '2026-09-28',
      time: '03:00 PM',
      address: 'RMZ Galleria Residences',
      flatNumber: '12B',
      floorNumber: '12th Floor',
      streetName: 'Yelahanka Main Rd',
      crossStreetName: 'Opposite Police Station',
      locality: 'Yelahanka',
      amount: '₹1,799',
      status: 'pending',
    },
    {
      id: 'p-3',
      srNo: 3,
      therapistName: 'Kangnu',
      therapistId: 'kangnu',
      clientName: 'Vikram Seth',
      date: '2026-09-29',
      time: '05:00 PM',
      address: 'Sobha Green Apartments',
      flatNumber: '301',
      floorNumber: '3rd Floor',
      streetName: '100 Feet Road',
      crossStreetName: 'Near Toit Pub',
      locality: 'Indiranagar',
      amount: '₹3,400',
      status: 'pending',
    },
  ],
  rejectedAppointments: initialRejected = [
    {
      id: 'r-1',
      srNo: 1,
      bookingDate: '2026-09-24',
      therapistName: 'Kangnu',
      therapistId: 'kangnu',
      clientName: 'Rahul Sharma',
      comments: 'Therapist unavailable at requested slot time due to prior booking in Electronic City.',
      date: '2026-09-24',
      time: '02:00 PM',
      address: 'Salarpuria Sattva',
      flatNumber: '105',
      floorNumber: '1st Floor',
      streetName: 'Hosur Main Road',
      crossStreetName: 'Near Silk Board',
      locality: 'BTM Layout',
      amount: '₹2,100',
      status: 'rejected',
    },
    {
      id: 'r-2',
      srNo: 2,
      bookingDate: '2026-09-22',
      therapistName: 'David',
      therapistId: 'david',
      clientName: 'Priya Nair',
      comments: 'Address outside evening coverage radius in North Bangalore; alternate slot proposed.',
      date: '2026-09-22',
      time: '08:00 PM',
      address: 'Embassy Boulevard',
      flatNumber: 'Villa 18',
      floorNumber: 'Ground Floor',
      streetName: 'Bellary Road',
      crossStreetName: 'Opposite International Airport Flyover',
      locality: 'Hebbal',
      amount: '₹3,400',
      status: 'rejected',
    },
  ],
  onShowAlert,
  onNavigateToBooking,
}) => {
  const [confirmedList, setConfirmedList] = useState<AppointmentItem[]>(initialConfirmed);
  const [pendingList, setPendingList] = useState<AppointmentItem[]>(initialPending);
  const [rejectedList, setRejectedList] = useState<AppointmentItem[]>(initialRejected);

  // Detail Modal state
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [selectedTherapistProfile, setSelectedTherapistProfile] = useState<TherapistProfile | null>(null);

  // Edit Modal state
  const [editingAppointment, setEditingAppointment] = useState<AppointmentItem | null>(null);

  // Helper to open therapist detail modal
  const handleTherapistClick = (therapistName: string, appointment?: AppointmentItem) => {
    const profile =
      THERAPISTS_DATA.find((t) => t.name.toLowerCase() === therapistName.toLowerCase()) ||
      THERAPISTS_DATA.find((t) => t.id === appointment?.therapistId) ||
      THERAPISTS_DATA[0];

    setSelectedTherapistProfile(profile);
    if (appointment) {
      setSelectedAppointment(appointment);
    } else {
      // Dummy appointment fallback if only therapist name passed
      setSelectedAppointment({
        id: `view-${Date.now()}`,
        srNo: 1,
        therapistName: profile.name,
        therapistId: profile.id,
        date: '2026-09-28',
        time: '11:00 AM',
        address: 'Bangalore Doorstep Session',
        flatNumber: 'N/A',
        floorNumber: 'N/A',
        streetName: 'N/A',
        crossStreetName: 'N/A',
        locality: 'Bangalore',
        amount: '₹2,100',
        status: 'pending',
      });
    }
  };

  // Action: Cancel Pending Appointment
  const handleCancelPending = (appt: AppointmentItem) => {
    setPendingList((prev) => prev.filter((item) => item.id !== appt.id));
    onShowAlert(
      'Pending Appointment Cancelled',
      `Appointment ID #${appt.id} with ${appt.therapistName} has been cancelled successfully.\n\nNote: No Charge to cancel Pending Appt.`
    );
  };

  // Action: Cancel Confirmed Appointment
  const handleCancelConfirmed = (appt: AppointmentItem) => {
    const confirmCancel = window.confirm(
      `⚠️ WARNING: If appointment is cancelled within 4 hours of the confirmed appointment or after the confirmed appointment time then full cancel charge plus ola charges apply.\n\nAre you sure you want to request cancellation for confirmed appointment with ${appt.therapistName}?`
    );
    if (confirmCancel) {
      setConfirmedList((prev) => prev.filter((item) => item.id !== appt.id));
      onShowAlert(
        'Cancellation Requested',
        `Cancellation request submitted for confirmed appointment with ${appt.therapistName} on ${appt.date} at ${appt.time}.\n\nOur coordinator will review the cancellation time and calculate any applicable cancel fee plus Ola charges.`
      );
    }
  };

  // Action: Edit Appointment Request
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    if (editingAppointment.status === 'pending') {
      setPendingList((prev) =>
        prev.map((item) => (item.id === editingAppointment.id ? editingAppointment : item))
      );
    } else if (editingAppointment.status === 'confirmed') {
      setConfirmedList((prev) =>
        prev.map((item) => (item.id === editingAppointment.id ? editingAppointment : item))
      );
    } else if (editingAppointment.status === 'rejected') {
      setRejectedList((prev) =>
        prev.map((item) => (item.id === editingAppointment.id ? editingAppointment : item))
      );
    }

    onShowAlert(
      'Appointment Updated',
      `Appointment details for ${editingAppointment.therapistName} updated successfully!`
    );
    setEditingAppointment(null);
  };

  // Action: Delete Reject Appointment
  const handleDeleteRejected = (id: string) => {
    setRejectedList((prev) => prev.filter((item) => item.id !== id));
    onShowAlert('Deleted', 'Rejected appointment record deleted from your history.');
  };

  return (
    <div className="appointment-management-container w-full space-y-8 my-6 text-[#333]">
      {/* Overview Banner */}
      <div className="bg-[#fffdf7] border-2 border-[#a28321] rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#840000] m-0 flex items-center gap-2">
              <span>📋</span> Appointment Status & Management Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#228b22] font-semibold mt-1 mb-0">
              Track your confirmed, pending, and rejected doorstep spa session requests in real time.
            </p>
          </div>
          {onNavigateToBooking && (
            <button
              type="button"
              className="btn btn-action text-xs sm:text-sm px-4 py-2"
              onClick={onNavigateToBooking}
            >
              ➕ Book New Appointment
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: CONFIRMED APPOINTMENTS */}
      <div className="confirmed-appointments-section bg-[#fdfbf7] border-2 border-[#a28321] rounded-lg p-4 sm:p-6 shadow-md">
        <div className="border-b border-[#a28321]/40 pb-3 mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[#840000] m-0 flex items-center justify-between flex-wrap gap-2">
            <span>Confirmed Appointments</span>
            <span className="text-xs text-[#840000] font-normal italic">
              (Scroll down to view more) Click on Therapist name to view Appointment detail
            </span>
          </h3>
        </div>

        {/* Note banner */}
        <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] text-[#856404] p-3 rounded mb-4 text-xs sm:text-sm font-semibold leading-relaxed">
          <strong>Note:</strong> If appointment is cancelled within 4 hours of the confirmed appointment or after the confirmed appointment time then full cancel charge plus ola charges apply
        </div>

        {/* Empty state or table */}
        {confirmedList.length === 0 ? (
          <div className="bg-white/80 border border-[#e0d5c1] rounded-lg p-8 text-center my-4">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-base sm:text-lg font-bold text-[#840000] m-0">
              No Confirmed Apointment found currently
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Once your pending booking advance payment is verified, your confirmed appointment will be listed here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-[#a28321]/30 rounded">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-[#840000] text-[#ffdf88] uppercase text-[11px] font-bold sticky top-0">
                <tr>
                  <th className="p-2.5 border border-[#a28321]">Sr no.</th>
                  <th className="p-2.5 border border-[#a28321]">Therapist Name</th>
                  <th className="p-2.5 border border-[#a28321]">Date</th>
                  <th className="p-2.5 border border-[#a28321]">Time</th>
                  <th className="p-2.5 border border-[#a28321]">Address</th>
                  <th className="p-2.5 border border-[#a28321]">Flat number</th>
                  <th className="p-2.5 border border-[#a28321]">Floor number</th>
                  <th className="p-2.5 border border-[#a28321]">Street name</th>
                  <th className="p-2.5 border border-[#a28321]">Cross street name</th>
                  <th className="p-2.5 border border-[#a28321]">Locality</th>
                  <th className="p-2.5 border border-[#a28321]">Amount</th>
                  <th className="p-2.5 border border-[#a28321]">Cancel Request</th>
                  <th className="p-2.5 border border-[#a28321]">Edit Request</th>
                </tr>
              </thead>
              <tbody>
                {confirmedList.map((item, idx) => (
                  <tr key={item.id} className="bg-white hover:bg-[#fff9ef] transition">
                    <td className="p-2.5 border border-[#e0d5c1] font-bold text-center">{idx + 1}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">
                      <button
                        type="button"
                        className="text-[#840000] hover:text-[#b30af3] font-bold underline text-left cursor-pointer"
                        onClick={() => handleTherapistClick(item.therapistName, item)}
                        title="Click to view therapist & appointment details"
                      >
                        {item.therapistName}
                      </button>
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1] whitespace-nowrap">{item.date}</td>
                    <td className="p-2.5 border border-[#e0d5c1] whitespace-nowrap">{item.time}</td>
                    <td className="p-2.5 border border-[#e0d5c1] max-w-[150px] truncate">{item.address}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.flatNumber}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.floorNumber}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.streetName}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.crossStreetName}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.locality}</td>
                    <td className="p-2.5 border border-[#e0d5c1] font-bold text-[#840000]">{item.amount}</td>
                    <td className="p-2.5 border border-[#e0d5c1] text-center">
                      <button
                        type="button"
                        className="bg-[#d9534f] hover:bg-[#c9302c] text-white text-xs px-2.5 py-1 rounded shadow"
                        onClick={() => handleCancelConfirmed(item)}
                      >
                        Cancel Request
                      </button>
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1] text-center">
                      <button
                        type="button"
                        className="bg-[#337ab7] hover:bg-[#286090] text-white text-xs px-2.5 py-1 rounded shadow"
                        onClick={() => setEditingAppointment(item)}
                      >
                        Edit Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: PENDING APPOINTMENTS */}
      <div className="pending-appointments-section bg-[#fdfbf7] border-2 border-[#a28321] rounded-lg p-4 sm:p-6 shadow-md">
        <div className="border-b border-[#a28321]/40 pb-3 mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[#840000] m-0 flex items-center justify-between flex-wrap gap-2">
            <span>Pending Appointments</span>
            <span className="text-xs text-[#840000] font-normal italic">
              (Scroll down to view more) Click on Therapist name to view Appointment detail
            </span>
          </h3>
        </div>

        {/* Note banner */}
        <div className="bg-[#d4edda] border-l-4 border-[#28a745] text-[#155724] p-3 rounded mb-4 text-xs sm:text-sm font-semibold leading-relaxed flex items-center justify-between">
          <span>
            <strong>Note:</strong> No Charge to cancel Pending Appt
          </span>
          <span className="text-xs bg-[#28a745] text-white px-2 py-0.5 rounded uppercase font-bold">
            Free Cancellation
          </span>
        </div>

        {pendingList.length === 0 ? (
          <div className="bg-white/80 border border-[#e0d5c1] rounded-lg p-6 text-center my-4">
            <p className="text-sm font-semibold text-gray-600 m-0">No pending appointments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-[#a28321]/30 rounded">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-[#5a0101] text-[#ffdf88] uppercase text-[11px] font-bold sticky top-0">
                <tr>
                  <th className="p-2.5 border border-[#a28321]">Sr no.</th>
                  <th className="p-2.5 border border-[#a28321]">Therapist Name</th>
                  <th className="p-2.5 border border-[#a28321]">Date</th>
                  <th className="p-2.5 border border-[#a28321]">Time</th>
                  <th className="p-2.5 border border-[#a28321]">Address</th>
                  <th className="p-2.5 border border-[#a28321]">Flat number</th>
                  <th className="p-2.5 border border-[#a28321]">Floor number</th>
                  <th className="p-2.5 border border-[#a28321]">Street name</th>
                  <th className="p-2.5 border border-[#a28321]">Cross street name</th>
                  <th className="p-2.5 border border-[#a28321]">Locality</th>
                  <th className="p-2.5 border border-[#a28321]">Amount</th>
                  <th className="p-2.5 border border-[#a28321]">Cancel Request</th>
                  <th className="p-2.5 border border-[#a28321]">Edit Request</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map((item, idx) => (
                  <tr key={item.id} className="bg-white hover:bg-[#fff9ef] transition">
                    <td className="p-2.5 border border-[#e0d5c1] font-bold text-center">{idx + 1}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">
                      <button
                        type="button"
                        className="text-[#840000] hover:text-[#b30af3] font-bold underline text-left cursor-pointer"
                        onClick={() => handleTherapistClick(item.therapistName, item)}
                        title="Click to view therapist & appointment details"
                      >
                        {item.therapistName}
                      </button>
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1] whitespace-nowrap">{item.date}</td>
                    <td className="p-2.5 border border-[#e0d5c1] whitespace-nowrap">{item.time}</td>
                    <td className="p-2.5 border border-[#e0d5c1] max-w-[150px] truncate">{item.address}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.flatNumber}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.floorNumber}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.streetName}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.crossStreetName}</td>
                    <td className="p-2.5 border border-[#e0d5c1]">{item.locality}</td>
                    <td className="p-2.5 border border-[#e0d5c1] font-bold text-[#840000]">{item.amount}</td>
                    <td className="p-2.5 border border-[#e0d5c1] text-center">
                      <button
                        type="button"
                        className="bg-[#d9534f] hover:bg-[#c9302c] text-white text-xs px-2.5 py-1 rounded shadow"
                        onClick={() => handleCancelPending(item)}
                      >
                        Cancel Request
                      </button>
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1] text-center">
                      <button
                        type="button"
                        className="bg-[#337ab7] hover:bg-[#286090] text-white text-xs px-2.5 py-1 rounded shadow"
                        onClick={() => setEditingAppointment(item)}
                      >
                        Edit Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 3: REJECT APPOINTMENTS */}
      <div className="reject-appointments-section bg-[#fdfbf7] border-2 border-[#a28321] rounded-lg p-4 sm:p-6 shadow-md">
        <div className="border-b border-[#a28321]/40 pb-3 mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[#840000] m-0 flex items-center justify-between flex-wrap gap-2">
            <span>Reject Appointments</span>
            <span className="text-xs text-[#840000] font-normal italic">
              (Scroll down to view more) Click on Therapist name to view Appointment detail
            </span>
          </h3>
        </div>

        {rejectedList.length === 0 ? (
          <div className="bg-white/80 border border-[#e0d5c1] rounded-lg p-6 text-center my-4">
            <p className="text-sm font-semibold text-gray-600 m-0">No rejected appointments recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-[#a28321]/30 rounded">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-[#4a0101] text-[#ffdf88] uppercase text-[11px] font-bold sticky top-0">
                <tr>
                  <th className="p-2.5 border border-[#a28321]">Sr no.</th>
                  <th className="p-2.5 border border-[#a28321]">Booking Date</th>
                  <th className="p-2.5 border border-[#a28321]">Therapist Name</th>
                  <th className="p-2.5 border border-[#a28321]">Client Name</th>
                  <th className="p-2.5 border border-[#a28321]">Comments</th>
                  <th className="p-2.5 border border-[#a28321]">View</th>
                  <th className="p-2.5 border border-[#a28321]">Edit</th>
                  <th className="p-2.5 border border-[#a28321]">Delete</th>
                </tr>
              </thead>
              <tbody>
                {rejectedList.map((item, idx) => (
                  <tr key={item.id} className="bg-white hover:bg-[#fff9ef] transition">
                    <td className="p-2.5 border border-[#e0d5c1] font-bold text-center">{idx + 1}</td>
                    <td className="p-2.5 border border-[#e0d5c1] whitespace-nowrap">
                      {item.bookingDate || item.date}
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1]">
                      <button
                        type="button"
                        className="text-[#840000] hover:text-[#b30af3] font-bold underline text-left cursor-pointer"
                        onClick={() => handleTherapistClick(item.therapistName, item)}
                        title="Click to view therapist & appointment details"
                      >
                        {item.therapistName}
                      </button>
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1] font-semibold">{item.clientName || 'Client'}</td>
                    <td className="p-2.5 border border-[#e0d5c1] max-w-[220px] italic text-gray-700">
                      {item.comments || 'Slot unavailable'}
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1] text-center">
                      <button
                        type="button"
                        className="bg-[#5bc0de] hover:bg-[#31b0d5] text-white text-xs px-2.5 py-1 rounded shadow"
                        onClick={() => handleTherapistClick(item.therapistName, item)}
                      >
                        View
                      </button>
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1] text-center">
                      <button
                        type="button"
                        className="bg-[#337ab7] hover:bg-[#286090] text-white text-xs px-2.5 py-1 rounded shadow"
                        onClick={() => setEditingAppointment(item)}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="p-2.5 border border-[#e0d5c1] text-center">
                      <button
                        type="button"
                        className="bg-[#d9534f] hover:bg-[#c9302c] text-white text-xs px-2.5 py-1 rounded shadow"
                        onClick={() => handleDeleteRejected(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* THERAPIST & APPOINTMENT DETAIL MODAL */}
      {selectedTherapistProfile && selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#f5f0e8] border-2 border-[#840000] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              type="button"
              className="absolute top-3 right-3 text-2xl font-bold text-[#840000] hover:text-black"
              onClick={() => {
                setSelectedTherapistProfile(null);
                setSelectedAppointment(null);
              }}
            >
              ✕
            </button>

            <div className="flex items-center gap-4 border-b border-[#a28321]/40 pb-4 mb-4">
              <img
                src={selectedTherapistProfile.photo}
                alt={selectedTherapistProfile.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#a28321] shadow"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://californiamassage.in${selectedTherapistProfile.photo}`;
                }}
              />
              <div>
                <h3 className="text-2xl font-bold text-[#840000] m-0 flex items-center gap-2">
                  <span>{selectedTherapistProfile.name}</span>
                  <span className="text-sm text-amber-600 font-normal">
                    ★ {selectedTherapistProfile.rating}
                  </span>
                </h3>
                <p className="text-xs text-[#b30af3] font-bold m-0 mt-0.5">
                  {selectedTherapistProfile.gender} • {selectedTherapistProfile.experience} Experience • Certified Doorstep Royale Therapist
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTherapistProfile.specialties.map((s, idx) => (
                    <span key={idx} className="bg-[#e0d5c1] text-[#840000] text-[10px] font-bold px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Appointment specifics */}
            <div className="bg-white/80 border border-[#a28321]/40 rounded-lg p-4 space-y-2 text-xs sm:text-sm mb-4">
              <h4 className="font-bold text-[#840000] text-sm border-b border-[#a28321]/30 pb-1 m-0 mb-2">
                📌 Appointment Specifications & Address Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><strong>Status:</strong> <span className="uppercase font-bold text-[#840000]">{selectedAppointment.status}</span></div>
                <div><strong>Amount:</strong> <span className="font-bold text-[#228b22]">{selectedAppointment.amount}</span></div>
                <div><strong>Date:</strong> {selectedAppointment.date}</div>
                <div><strong>Time:</strong> {selectedAppointment.time}</div>
                <div><strong>Address:</strong> {selectedAppointment.address}</div>
                <div><strong>Flat No.:</strong> {selectedAppointment.flatNumber}</div>
                <div><strong>Floor No.:</strong> {selectedAppointment.floorNumber}</div>
                <div><strong>Street Name:</strong> {selectedAppointment.streetName}</div>
                <div><strong>Cross Street:</strong> {selectedAppointment.crossStreetName}</div>
                <div><strong>Locality:</strong> {selectedAppointment.locality}</div>
                {selectedAppointment.clientName && (
                  <div><strong>Client:</strong> {selectedAppointment.clientName}</div>
                )}
                {selectedAppointment.comments && (
                  <div className="col-span-1 sm:col-span-2 text-red-700 italic">
                    <strong>Comments:</strong> {selectedAppointment.comments}
                  </div>
                )}
              </div>
            </div>

            {/* Policy Reminder */}
            <div className="bg-[#fff9ef] border border-[#a28321] p-3 rounded text-xs text-[#4a3200] space-y-1">
              <p className="m-0"><strong>🛺 Travel Charges:</strong> 2-way auto fare from therapist location to client location & back (not included in service fee, based on actual auto fare).</p>
              <p className="m-0"><strong>🔒 Advance & Cancellation:</strong> Mandatory ₹500 advance deposit required. If confirmed appointment is cancelled within 4 hours or after time, full cancel charge + Ola fare applies.</p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <a
                href={`tel:${SPA_PHONE}`}
                className="btn btn-action text-xs px-4 py-2 inline-flex items-center gap-1 no-underline text-[#ffdf88]"
              >
                📞 Call Coordinator ({SPA_PHONE})
              </a>
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded font-bold"
                onClick={() => {
                  setSelectedTherapistProfile(null);
                  setSelectedAppointment(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT REQUEST MODAL */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#f5f0e8] border-2 border-[#840000] rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              type="button"
              className="absolute top-3 right-3 text-2xl font-bold text-[#840000] hover:text-black"
              onClick={() => setEditingAppointment(null)}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-[#840000] mb-3 border-b border-[#a28321]/40 pb-2">
              Edit Appointment Request - {editingAppointment.therapistName}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Therapist Name</label>
                  <input
                    type="text"
                    value={editingAppointment.therapistName}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, therapistName: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Amount</label>
                  <input
                    type="text"
                    value={editingAppointment.amount}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, amount: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Date</label>
                  <input
                    type="date"
                    value={editingAppointment.date}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, date: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Time</label>
                  <input
                    type="text"
                    value={editingAppointment.time}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, time: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#840000] mb-1">Address</label>
                <input
                  type="text"
                  value={editingAppointment.address}
                  onChange={(e) =>
                    setEditingAppointment({ ...editingAppointment, address: e.target.value })
                  }
                  className="form-control"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Flat Number</label>
                  <input
                    type="text"
                    value={editingAppointment.flatNumber}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, flatNumber: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Floor Number</label>
                  <input
                    type="text"
                    value={editingAppointment.floorNumber}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, floorNumber: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Street Name</label>
                  <input
                    type="text"
                    value={editingAppointment.streetName}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, streetName: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Cross Street Name</label>
                  <input
                    type="text"
                    value={editingAppointment.crossStreetName}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, crossStreetName: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#840000] mb-1">Locality</label>
                <input
                  type="text"
                  value={editingAppointment.locality}
                  onChange={(e) =>
                    setEditingAppointment({ ...editingAppointment, locality: e.target.value })
                  }
                  className="form-control"
                />
              </div>

              {editingAppointment.status === 'rejected' && (
                <div>
                  <label className="block font-bold text-[#840000] mb-1">Rejection Comments</label>
                  <textarea
                    rows={2}
                    value={editingAppointment.comments || ''}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, comments: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-4 py-2 rounded font-bold"
                  onClick={() => setEditingAppointment(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-action text-xs px-5 py-2 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
