import { Head } from '@inertiajs/react';
import { Palette } from 'lucide-react';
import AppearanceTabs from '@/components/appearance-tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Pengaturan Tampilan" />

            <h1 className="sr-only">Pengaturan Tampilan</h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <Palette className="text-primary size-5" />
                            Tema Antarmuka
                        </CardTitle>
                        <CardDescription>
                            Pilih gaya tema yang paling nyaman untuk penggunaan Anda di Sistem Informasi Laboratorium Fisika.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AppearanceTabs />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Tampilan',
            href: editAppearance(),
        },
    ],
};
