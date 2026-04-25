import React from "react";
import { Phone, Mail, MapPin, Clock, Building2 } from "lucide-react";
import { companyInfo } from "../data/company";

const Contacts: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Контакты</h1>
          <p className="text-gray-600 text-lg">
            Свяжитесь с нами, чтобы получить дополнительную информацию о наших товарах и услугах
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-start gap-4 mb-6">
                <Building2 className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{companyInfo.name}</h3>
                  <p className="text-sm text-gray-600">УНП {companyInfo.taxNumber}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Адрес</h3>
                <p className="text-gray-600">
                  {companyInfo.address.city}
                </p>
                <p className="text-gray-600">
                  {companyInfo.address.street}
                </p>
                <p className="text-gray-600">
                  {companyInfo.address.floor}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Телефон</h3>
                <a 
                  href={`tel:${companyInfo.phone}`}
                  className="text-[#1B4B43] hover:underline text-lg font-semibold"
                >
                  {companyInfo.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <div className="space-y-2">
                  <a 
                    href={`mailto:${companyInfo.emails.primary}`}
                    className="block text-[#1B4B43] hover:underline"
                  >
                    {companyInfo.emails.primary}
                  </a>
                  <a 
                    href={`mailto:${companyInfo.emails.secondary}`}
                    className="block text-[#1B4B43] hover:underline"
                  >
                    {companyInfo.emails.secondary}
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-[#1B4B43] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Время работы</h3>
                <div className="space-y-1 text-gray-600">
                  <p>{companyInfo.workingHours.weekday}</p>
                  <p>{companyInfo.workingHours.saturday}</p>
                  <p>{companyInfo.workingHours.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-gradient-to-br from-[#1B4B43] to-[#0f2f2a] text-white p-8 rounded-lg h-fit">
            <h3 className="font-semibold text-2xl mb-6">Банковские реквизиты</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-white/70 text-sm mb-1">Банк</p>
                <p className="text-lg font-semibold">{companyInfo.bankDetails.bank}</p>
              </div>

              <div>
                <p className="text-white/70 text-sm mb-1">Расчетный счет</p>
                <p className="text-lg font-mono break-all">{companyInfo.bankDetails.accountNumber}</p>
              </div>

              <div>
                <p className="text-white/70 text-sm mb-1">BIC</p>
                <p className="text-lg font-mono">{companyInfo.bankDetails.bic}</p>
              </div>

              <div className="border-t border-white/20 pt-6 mt-6">
                <p className="text-white/70 text-sm mb-1">УНП</p>
                <p className="text-lg font-semibold">{companyInfo.taxNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Optional) */}
      <div className="bg-gray-100 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Найти нас</h2>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-600">Карта будет добавлена позже</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
