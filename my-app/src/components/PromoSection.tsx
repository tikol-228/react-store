export default function PromoSection() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-3 gap-6">
        
        {/* LEFT BIG CARD */}
        <div className="col-span-2 bg-[#A8D5C2] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div>
            <p className="text-sm tracking-wide text-gray-700">
              LIMITED TIME OFFER
            </p>
            <h2 className="text-4xl font-bold mt-2">
              Save <br /> 20%
            </h2>
          </div>

          {/* IMAGE PLACEHOLDER */}
          <div className="absolute right-6 bottom-6 text-sm text-gray-600">
            {/* Image will be added here */}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">
          
          {/* TOP RIGHT CARD */}
          <div className="bg-[#F3D6A4] rounded-2xl p-6 relative min-h-[140px] flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Free Shipping on <br /> Orders Over
              </p>
              <h3 className="text-2xl font-bold mt-1">$50</h3>
            </div>

            {/* IMAGE PLACEHOLDER */}
            <div className="text-sm text-gray-600">
              [IMAGE HERE]
            </div>
          </div>

          {/* BOTTOM RIGHT CARD */}
          <div className="bg-[#B7E1CD] rounded-2xl p-6 relative min-h-[140px] flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                Exclusive <br /> Discounts!
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                For New Customers
              </p>
            </div>

            {/* IMAGE PLACEHOLDER */}
            <div className="text-sm text-gray-600">
              [IMAGE HERE]
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}