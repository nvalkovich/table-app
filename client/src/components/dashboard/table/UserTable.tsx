import React, { useState, useMemo } from 'react';
import { Table, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { User, CurrentUser } from '../../../types/types';
import { resources } from '../../../common/resources';
import { formatDistanceToNow, format } from 'date-fns';
import { DATE_FORMAT } from '../../../common/constants';

interface UserTableProps {
    users: User[];
    onSelectUsers: (ids: number[]) => void;
    currentUser?: CurrentUser;
}

const UserTable = ({ users, onSelectUsers, currentUser }: UserTableProps) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { tableValues } = resources;

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = users.map((user) => user.id);
            setSelectedIds(allIds);
            onSelectUsers(allIds);
        } else {
            setSelectedIds([]);
            onSelectUsers([]);
        }
    };

    const handleSelect = (id: number) => {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter((selectedId) => selectedId !== id)
            : [...selectedIds, id];
        setSelectedIds(newSelectedIds);
        onSelectUsers(newSelectedIds);
    };

    const isAllSelected =
        selectedIds.length === users.length && users.length > 0;

    const formatTimeAgo = (date: Date) => {
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const formatDate = (date: Date) => {
        return format(date, DATE_FORMAT);
    };

    const sortedUsers = useMemo(() => {
        return users?.sort((a, b) => {
            if (!a.lastLoginAt && !b.lastLoginAt) return 0;
            if (!a.lastLoginAt) return 1;
            if (!b.lastLoginAt) return -1;

            return (
                new Date(b.lastLoginAt).getTime() -
                new Date(a.lastLoginAt).getTime()
            );
        });
    }, [users]);

    return (
        <div
            style={{
                maxHeight: '60vh',
            }}
            className="table-responsive overflow-y-auto"
        >
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th>{tableValues.name}</th>
                        <th>{tableValues.email}</th>
                        <th>{tableValues.status}</th>
                        <th>{tableValues.lastLogin}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map((user) => {
                        const loginDate = user.lastLoginAt || user.createdAt;
                        const formattedDate = formatDate(new Date(loginDate));
                        const timeAgo = formatTimeAgo(new Date(loginDate));

                        return (
                            <tr
                                key={user.id}
                                style={{
                                    fontStyle:
                                        user.id === currentUser?.id
                                            ? 'italic'
                                            : 'inherit',
                                }}
                            >
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedIds.includes(user.id)}
                                        onChange={() => handleSelect(user.id)}
                                    />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id={`tooltip-${user.id}`}>
                                                {formattedDate}
                                            </Tooltip>
                                        }
                                    >
                                        <span style={{ cursor: 'pointer' }}>
                                            {timeAgo}
                                        </span>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTable;
