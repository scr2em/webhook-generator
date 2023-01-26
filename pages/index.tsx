import type { InferGetServerSidePropsType } from "next";
import { IoCopyOutline, IoRefreshOutline } from "react-icons/io5";
import { BiLinkExternal } from "react-icons/bi";
import { useEffect, useState } from "react";
import { generateWebhookUrl, getWebhookRequests, subscribeToWebhookRequests } from "../lib/dbQueries";
import RequestListItem from "../components/requestListItem";
import { WebhookRequest } from "../types";
import Link from "next/link";
import { Skeleton, Tooltip, useToast } from "@chakra-ui/react";
import JsonViewer from "../components/JSONViewer";

const Home = ({ queryUrl, oldRequests }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [url, setUrl] = useState("");
    const [requests, setRequests] = useState<WebhookRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>();

    useEffect(() => {
        setUrl(queryUrl);
        setSelectedRequest(null);
        if (Array.isArray(oldRequests)) {
            setRequests(oldRequests);
        }
    }, [queryUrl]);

    useEffect(() => {
        if (url) {
            subscribeToWebhookRequests(url, (newRequest) => {
                setRequests((prev) => [newRequest, ...prev]);
            });
        }
    }, [url]);

    function handleRequestClick(req: WebhookRequest) {
        setSelectedRequest(req);
    }

    const webhookUrl = url ? `${location.origin}/api/webhook/${url}` : "";
    const toast = useToast();

    return (
        <div className=" container max-w-5xl  mx-auto mt-4">
            <div className="grid gap-4 grid-cols-12">
                <div className="col-span-12 bg-gray-50 shadow dark:bg-gray-800 rounded-lg p-10 grid place-items-center">
                    <span>Your generated webhook URL</span>
                    {webhookUrl && (
                        <span className="flex items-center gap-4">
                            {webhookUrl}

                            <Tooltip label="Copy" aria-label="A tooltip">
                                <span
                                    className=" px-2 py-1"
                                    onClick={() => {
                                        navigator.clipboard.writeText(webhookUrl);
                                        toast({
                                            title: "URL copied.",
                                            description: "",
                                            status: "success",
                                            duration: 1500,
                                            isClosable: true,
                                            position: "top-right",
                                        });
                                    }}
                                >
                                    <IoCopyOutline />
                                </span>
                            </Tooltip>

                            <Tooltip label="Open external URL" aria-label="A tooltip">
                                <a href={webhookUrl} target="_blank">
                                    <BiLinkExternal />
                                </a>
                            </Tooltip>
                            <Tooltip label="Generate a new URL" aria-label="A tooltip">
                                <Link href="/">
                                    <IoRefreshOutline />
                                </Link>
                            </Tooltip>
                        </span>
                    )}
                    {!url && <Skeleton height="20px" />}
                </div>
                <div className="col-span-3">
                    <aside className="w-full" aria-label="Sidebar">
                        <div className="px-3 py-4 overflow-y-auto rounded-lg bg-gray-50 shadow dark:bg-gray-800">
                            <ul className="space-y-2">
                                <span>Listening for requests...</span>
                                {requests.map((req) => {
                                    return (
                                        <RequestListItem
                                            id={req.id}
                                            onClick={() => handleRequestClick(req)}
                                            method={req.method}
                                            host={req.headers.host}
                                            createdAt={req.created_at}
                                            selected={selectedRequest?.id === req.id}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </aside>
                </div>
                <div className="col-span-9">{selectedRequest && <JsonViewer src={selectedRequest} />}</div>
            </div>
        </div>
    );
};

export default Home;

export async function getServerSideProps(context: { query: { url: string } }) {
    let queryUrl = context.query.url || "";

    if (queryUrl) {
        const { error, data = [] } = await getWebhookRequests(queryUrl);
        if (error) {
            return {
                notFound: true,
            };
        }
        return {
            props: { queryUrl: queryUrl, oldRequests: data },
        };
    }

    const { error, data } = await generateWebhookUrl();
    if (error) {
        return {
            notFound: true,
        };
    }
    queryUrl = data?.[0]?.url || "";

    return {
        redirect: {
            destination: "/?url=" + queryUrl,
            permanent: true,
        },
        props: { queryUrl: queryUrl, oldRequests: [] },
    };
}
