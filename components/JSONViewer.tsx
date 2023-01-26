import React, { useState } from "react";
import { Json } from "../types/supabase";
import { TabList, Tabs } from "@chakra-ui/tabs";
import { Switch } from "@chakra-ui/switch";
import { set } from "immutable";

const JsonViewer = ({ src = {} }: { src: Json }) => {
    const [jsonView, setJsonView] = useState(false);
    return (
        <>
            <div className="w-full bg-gray-50">
                <div className="flex items-center gap-3 justify-end ">
                    Plain JSON
                    <Switch id="email-alerts" isChecked={jsonView} onChange={() => setJsonView(!jsonView)} />
                </div>
                <div className="relative overflow-x-auto bg-gray-100">
                    {jsonView ? (
                        <pre>{JSON.stringify(src, null, 2)}</pre>
                    ) : (
                        <table className="w-full text-sm text-left  dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Key
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {src &&
                                    Object.entries(src).map(([key, value]) => {
                                        return (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th
                                                    scope="row"
                                                    className="px-2 py-2 font-medium  whitespace-nowrap dark:text-white"
                                                >
                                                    {key}
                                                </th>
                                                <td className="px-2 py-2">
                                                    {typeof value === "object" ? (
                                                        <pre className="bg-gray-100">
                                                            {JSON.stringify(value, null, 2)}
                                                        </pre>
                                                    ) : (
                                                        <span className="bg-gray-100">{value}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default JsonViewer;
