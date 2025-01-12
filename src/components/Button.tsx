import { ButtonProps } from "@/@types/global"
import { FC } from "react"

const Button: FC<ButtonProps> = ({ ...props }) => {
    return (
        <button {...props}>{props.text}</button>
    )
}

export default Button