interface HeaderProps {
    header: string,
}

const Header = (props: HeaderProps) => {
    return(
        <div>
            <h1>{props.header}</h1>
        </div>
    )
}

export default Header