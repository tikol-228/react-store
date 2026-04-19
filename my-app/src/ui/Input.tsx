interface InputProps {
    type: string
    className: string
    placeholder: any
}

const Input = ({ type, className, placeholder }: InputProps) => {
  return <input type={type} className={className} placeholder={placeholder} />
}

export default Input