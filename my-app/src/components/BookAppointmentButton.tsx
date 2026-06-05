import { TELEGRAM_URL } from '../data/company';

type BookAppointmentButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

const BookAppointmentButton = ({
  children = 'Подобрать косметику',
  className,
}: BookAppointmentButtonProps) => (
  <a
    href={TELEGRAM_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    aria-label="Написать в Telegram +375296894693"
  >
    {children}
  </a>
);

export default BookAppointmentButton;
