import { Users, Wrench, Clock, Smile } from "lucide-react";

function AboutFigure() {
  return (
    <>
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 p-12 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {[
          { icon: Users, value: '5.000+', label: 'Xe được bảo dưỡng' },
          { icon: Wrench, value: '10', label: 'Kỹ thuật viên chuyên nghiệp' },
          { icon: Clock, value: '45 phút', label: 'Trung bình/lượt sửa' },
          { icon: Smile, value: '98%', label: 'Khách hàng hài lòng' }
        ].map(({ icon: Icon, value, label }, idx) => (
          <div key={idx} className="space-y-2">
            <Icon className="mx-auto" size={36} />
            <p className="text-4xl font-bold text-orange-600">{value}</p>
            <p className="text-gray-700">{label}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export default AboutFigure;