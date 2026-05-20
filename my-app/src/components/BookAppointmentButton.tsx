import { useLocation, useNavigate } from 'react-router-dom';
import { goToProductsCatalog } from '../utils/scrollToSection';

type BookAppointmentButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

const BookAppointmentButton = ({
  children = 'Подобрать косметику',
  className,
}: BookAppointmentButtonProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (location.pathname === '/') {
      goToProductsCatalog();
      return;
    }
    navigate({ pathname: '/', hash: '#products' }, { state: { scrollToProducts: true } });
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default BookAppointmentButton;
