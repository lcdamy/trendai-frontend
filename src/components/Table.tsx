"use client";
import * as React from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from "@mui/material";
import { TableProps, TableRows } from "@/@types/global";
import dayjs from "dayjs";

const env = process.env.NEXT_PUBLIC_TRENDAI_API

const TableComponent: React.FC<TableProps> = ({ rows }) => {

    const handleChangeStatus = async (status: string , id: string) => {

        const token: string | null = localStorage.getItem("jwt_token");
        const payload = {
            status
        }

        const contentAPI = `${env}/influencer/${id}`;
        const response = await fetch(contentAPI, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log("Data", data)

        if (response.ok) {

        }

    }
    return (
        <React.Fragment>
            <div className="flex gap-4 cursor-pointer py-4">
                <header className='font-semibold text-xl'>Total Posts</header>
                <Typography variant="subtitle1" className="px-2 border border-[#89e81d] rounded-md">Approved: {rows && rows.filter((row) => row.status?.toLowerCase() === "approve").length}</Typography>
                <Typography variant="subtitle1" className="px-2 border border-[#89e81d] rounded-md">Pending: {rows && rows.filter((row) => row.status?.toLowerCase() === "pending").length}</Typography>
                <Typography variant="subtitle1" className="px-2 border border-[#89e81d] rounded-md">Rejected: {rows && rows.filter((row) => row.status?.toLowerCase() === "reject").length}</Typography>
            </div>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="left">Submission Date</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: TableRows, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left" component="th" scope="row">{row.social}</TableCell>
                                <TableCell align="left">{row.content}</TableCell>
                                <TableCell align="left">{dayjs(row.createdAt).format("YYYY-MM-DD")}</TableCell>
                                <TableCell align="left">
                                    <>
                                        <div className="flex gap-4">
                                            {row.status?.toLowerCase() === "rejected" || row.status?.toLowerCase() === "pending" && (<button type="button" className={`bg-red-500 rounded-full py-2 px-4 text-white`} onClick={() => handleChangeStatus("Reject", row._id)}>
                                                Reject
                                            </button>)}
                                            {row.status?.toLowerCase() === "pending" && <button type="button" className={`bg-green-500  rounded-full py-2 px-4 text-white`} onClick={() => handleChangeStatus("Approve", row._id)}>
                                                Approve
                                            </button>}

                                            {row.status?.toLowerCase() === "approve" && <Typography className={`border border-green-500  rounded-md py-1 px-4 text-green-600 font-bold`}>
                                                Approved
                                            </Typography>}

                                            {row.status?.toLowerCase() === "reject" && <Typography  className={`border border-red-500  rounded-md py-1 px-4 text-red-600 font-bold`}>
                                                Rejected
                                            </Typography>}
                                        </div>
                                    </>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
};

export default TableComponent;