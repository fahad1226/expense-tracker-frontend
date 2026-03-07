import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function show_data(data: unknown) {
    return JSON.stringify(data);
}

export function formatDataPreview(data: unknown) {
    return (
        <>
            <div className="rounded-xl bg-white shadow p-6 mb-6 border border-gray-100">
                <h2 className="mb-3 text-lg font-semibold text-gray-800">
                    Raw Data Preview
                </h2>
                <div className="text-sm leading-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody>
                            {Object.entries(
                                data as Record<string, unknown>,
                            ).map(([key, value]) => (
                                <tr
                                    key={key}
                                    className="hover:bg-gray-50 align-top"
                                >
                                    <td className="py-2 pr-4 font-medium text-gray-700 capitalize whitespace-nowrap">
                                        {key.replace(/([A-Z])/g, " $1")}
                                    </td>
                                    <td className="py-2 pl-4 text-gray-700 break-all">
                                        {Array.isArray(value) ? (
                                            <ul className="list-disc ml-6 space-y-1">
                                                {value.length === 0 ? (
                                                    <li>
                                                        <span className="text-gray-400 italic">
                                                            (empty)
                                                        </span>
                                                    </li>
                                                ) : (
                                                    value.map((item, idx) => (
                                                        <li
                                                            key={idx}
                                                            className=""
                                                        >
                                                            {typeof item ===
                                                                "object" &&
                                                            item !== null ? (
                                                                <pre className="text-xs bg-gray-50 rounded-md p-2 my-1">
                                                                    {show_data(
                                                                        item,
                                                                    )}
                                                                </pre>
                                                            ) : (
                                                                <span>
                                                                    {show_data(
                                                                        item,
                                                                    )}
                                                                </span>
                                                            )}
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        ) : typeof value === "object" &&
                                          value !== null ? (
                                            <pre className="text-xs bg-gray-50 rounded-md p-2 my-1 overflow-x-auto">
                                                {show_data(value)}
                                            </pre>
                                        ) : (
                                            show_data(value)
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
