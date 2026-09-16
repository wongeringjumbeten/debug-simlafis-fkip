import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-8 rounded-md object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    SIMLAFIS
                </span>
            </div>
        </>
    );
}
