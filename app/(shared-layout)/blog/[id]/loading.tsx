import { Skeleton } from "@/components/ui/skeleton";

function loading() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <Skeleton className="h-10 w-24 mb-6" />
            <Skeleton className="w-full h-100 mb-8 rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2 mt-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2/3 w-full" />
            </div>
        </div>
    );
}

export default loading;
