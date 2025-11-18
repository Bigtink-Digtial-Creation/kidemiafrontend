import { Circles } from 'react-loader-spinner';

export default function SpinnerCircle({
    height = 80, width = 80, color = '#BF4C20', label = "Loading-Assessment" }:
    { height?: number; width?: number; color?: string; label?: string }) {

    return (<Circles
        height={height}
        width={width}
        color={color}
        ariaLabel={label}
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
    />)

}