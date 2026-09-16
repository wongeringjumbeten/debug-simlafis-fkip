import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            src="/images/logo-fkip.png"
            alt="Logo FKIP UNEJ"
            {...props}
        />
    );
}
