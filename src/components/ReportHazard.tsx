import React, { useState } from 'react';
import {
  AlertTriangle,
  Upload,
  X,
  Trash2,
  CheckCircle,
  Clock,
  Shield,
  Camera,
  MapPin,
  Send,
} from 'lucide-react';
import { useSensorContext } from '../context/SensorContext';
import { HazardReport } from '../types';

export const ReportHazard: React.FC = () => {
  const { hazardReports, addHazardReport, deleteHazardReport } = useSensorContext();

  const [reporterName, setReporterName] = useState<string>('');
  const [hazardType, setHazardType] = useState<HazardReport['hazardType']>('Flooding');
  const [location, setLocation] = useState<string>('');
  const [severity, setSeverity] = useState<HazardReport['severity']>('Medium');
  const [description, setDescription] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  // Handle local photo selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!location.trim()) {
      setValidationError('Please enter a specific village location or landmark.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setValidationError('Please provide a brief description (at least 10 characters).');
      return;
    }

    addHazardReport({
      reporterName: reporterName.trim() || undefined,
      hazardType,
      location: location.trim(),
      severity,
      description: description.trim(),
      imageUrl: imagePreview || undefined,
    });

    // Reset form
    setReporterName('');
    setLocation('');
    setDescription('');
    setImagePreview(null);
    setSeverity('Medium');
    setSuccessMessage('Hazard observation logged successfully in local browser storage.');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const confirmDelete = (id: string) => {
    deleteHazardReport(id);
    setReportToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Scope Notice */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Community Hazard Incident Reporter
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empower villagers and local observers to report blocked culverts, rising washouts, and roadway obstructions
            </p>
          </div>
        </div>

        {/* Local Storage Disclaimer */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
          <strong>Privacy & Scope Protocol:</strong> This prototype saves reports solely to your browser&apos;s LocalStorage. It does not transmit data to emergency call centers, police, or NDRF. Do not submit sensitive personal identifiers. For imminent life-threatening emergencies, dial <strong>112</strong> or <strong>1077</strong> (Disaster Helpline).
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Log New Hazard Observation
          </h3>

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {validationError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Reporter Name (Optional) */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Reporter Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Village Youth Volunteer / Anonymous"
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Hazard Type & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Hazard Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={hazardType}
                  onChange={e => setHazardType(e.target.value as HazardReport['hazardType'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Flooding">Flooding</option>
                  <option value="Waterlogging">Waterlogging</option>
                  <option value="Blocked drainage">Blocked drainage</option>
                  <option value="Road obstruction">Road obstruction</option>
                  <option value="Heavy rainfall">Heavy rainfall</option>
                  <option value="Other">Other environmental hazard</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Severity Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as HazardReport['severity'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Low">Low (Informational)</option>
                  <option value="Medium">Medium (Impacting foot traffic)</option>
                  <option value="High">High (Submerged roadway)</option>
                  <option value="Critical">Critical (Immediate breach)</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Specific Location / Landmark <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Near Panchayat School bridge culvert"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Description of Hazard <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe water depth, debris obstruction, or damage observed..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {/* Optional Image Upload */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Attach Photo Evidence <span className="text-slate-400 font-normal">(Optional preview)</span>
              </label>
              {imagePreview ? (
                <div className="relative inline-block mt-1">
                  <img
                    src={imagePreview}
                    alt="Uploaded hazard preview"
                    className="w-32 h-24 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 hover:bg-rose-700 shadow-xs"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 text-xs">
                    Click to select photo (JPEG/PNG, max 2MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Hazard Report to Local Registry</span>
            </button>
          </form>
        </div>

        {/* Existing Reports List */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Community Reports Log ({hazardReports.length})
              </h3>
              <span className="text-xs text-slate-500">
                Persisted in LocalStorage
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {hazardReports.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No community reports logged yet.
                </div>
              ) : (
                hazardReports.map(report => (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-2 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {report.hazardType}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              report.severity === 'Critical'
                                ? 'bg-rose-100 text-rose-800'
                                : report.severity === 'High'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {report.severity} Severity
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{report.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setReportToDelete(report.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-slate-700 text-xs leading-relaxed">
                      {report.description}
                    </p>

                    {report.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={report.imageUrl}
                          alt="Hazard evidence"
                          className="w-24 h-18 object-cover rounded border border-slate-200"
                        />
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Reporter: {report.reporterName || 'Anonymous Villager'}</span>
                      <span className="font-mono">{report.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Reports stored in browser memory only · Delete at any time
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Confirm Report Deletion
            </h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this demonstration hazard report from local storage? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReportToDelete(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(reportToDelete)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
