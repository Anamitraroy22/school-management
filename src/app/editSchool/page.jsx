"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { School, MapPin, Phone, Mail, Upload, CheckCircle, AlertCircle, Home, Loader } from 'lucide-react';

// NOTE: In a real Next.js app, the school ID would be extracted from the URL path.
// For this single-file demonstration, we are using a placeholder ID.
// You would replace 'placeholder-id' with the actual school ID from your routing system.
const SCHOOL_ID_PLACEHOLDER = 'placeholder-id';

export default function EditSchool() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [schoolData, setSchoolData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // Fetch school data to pre-populate the form
  useEffect(() => {
    const fetchSchool = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const response = await fetch(`/api/schools/${SCHOOL_ID_PLACEHOLDER}`);
        const result = await response.json();
        
        if (result.success) {
          const data = result.data;
          setSchoolData(data);
          // Set form values
          setValue('name', data.school_name);
          setValue('address', data.address);
          setValue('city', data.city);
          setValue('state', data.state);
          setValue('contact', data.contact_number);
          setValue('email_id', data.email_address);
          setImagePreview(data.image); // Set initial image preview
        } else {
          setFetchError(result.error || 'Failed to fetch school data.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setFetchError('Network error. Failed to load school data.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchSchool();
  }, [setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const payload = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        contact: data.contact,
        email_id: data.email_id,
        image: imagePreview, // Use the base64 preview, which could be old or new
      };

      // If a new image file exists, convert it to a Base64 string
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
        payload.image = base64Image;
      }

      const response = await fetch(`/api/schools/${SCHOOL_ID_PLACEHOLDER}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ type: 'success', message: 'School updated successfully! 🎉' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Failed to update school' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white";
  const errorClasses = "border-red-500 focus:ring-red-500";

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading School Data...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-lg font-medium text-gray-700 text-center">{fetchError}</p>
          <a href="/showSchools" className="mt-4 inline-flex items-center px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Back to Schools
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-6">
          <a href="/showSchools" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Home className="w-4 h-4" />
            Back to All Schools
          </a>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <School className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit School Details</h1>
          <p className="text-gray-600">Update the information for {schoolData?.school_name}</p>
        </motion.div>

        {/* Status Messages */}
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{submitStatus.message}</span>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* School Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                School Name *
              </label>
              <div className="relative">
                <School className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('name', { 
                    required: 'School name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className={`${inputClasses} pl-11 ${errors.name ? errorClasses : ''}`}
                  placeholder="Enter school name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <textarea
                  {...register('address', { 
                    required: 'Address is required',
                    minLength: { value: 10, message: 'Please provide a complete address' }
                  })}
                  className={`${inputClasses} pl-11 resize-none h-20 ${errors.address ? errorClasses : ''}`}
                  placeholder="Enter complete address"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  {...register('city', { 
                    required: 'City is required',
                    minLength: { value: 2, message: 'Enter a valid city name' }
                  })}
                  className={`${inputClasses} ${errors.city ? errorClasses : ''}`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  {...register('state', { 
                    required: 'State is required',
                    minLength: { value: 2, message: 'Enter a valid state name' }
                  })}
                  className={`${inputClasses} ${errors.state ? errorClasses : ''}`}
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    {...register('contact', { 
                      required: 'Contact number is required',
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: 'Please enter a valid phone number (10-15 digits)'
                      }
                    })}
                    className={`${inputClasses} pl-11 ${errors.contact ? errorClasses : ''}`}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.contact && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...register('email_id', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`${inputClasses} pl-11 ${errors.email_id ? errorClasses : ''}`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                School Image
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500 font-medium">Click to upload new image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      {...register('image')}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageChange(e);
                        register('image').onChange(e);
                      }}
                    />
                  </label>
                </div>
                
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Image Preview:</p>
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-auto object-cover rounded-lg shadow-md border"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Updating School...
                </>
              ) : (
                <>
                  <School className="w-5 h-5" />
                  Update School
                </>
              )}
            </motion.button>
            
            <div className="text-center">
              <a href="/showSchools" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Cancel
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
