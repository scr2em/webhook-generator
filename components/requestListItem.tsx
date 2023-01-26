import TimeAgo from "react-timeago";
const methodsColors = {
    GET: "bg-green-500",
    POST: "bg-yellow-500",
    UPDATE: "bg-blue-500",
    DELETE: "bg-red-500",
};

export default function RequestListItem({
    id,
    method,
    ip = "",
    onClick,
    createdAt,
    selected,
}: {
    id: number;
    method: string;
    ip?: string;
    onClick: any;
    createdAt: string;
    selected: boolean;
}) {
    return (
        <li onClick={onClick}>
            <div
                className={
                    "flex flex-col  p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer " +
                    (selected ? "bg-gray-200" : "")
                }
            >
                <div className=" flex  whitespace-nowrap">
                    <span className="flex-1 overflow-hidden text-ellipsis  ">
                        #{id} {ip}
                    </span>
                    <span
                        className={
                            " flex-shrink-0 grid place-items-center uppercase text-white rounded px-1 font-bold text-xs mx-1 " +
                            // @ts-ignore
                            methodsColors[method]
                        }
                    >
                        {method}
                    </span>
                </div>
                <TimeAgo date={createdAt} className="text-sm" />
            </div>
        </li>
    );
}
