/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import {
    PlusSquare, Edit2, Trash2, Loader2, Search,
    MoreHorizontal, Settings, Activity, AlertTriangle,
    ChevronRight, ChevronLeft, Database, Eye, Clock
} from 'lucide-react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';

import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from '../../components/ui/badge';
import { useSystemLogs } from '../../hooks/useSystemLogs';
import { PaginationState } from '@tanstack/react-table';

export default function LoggingManagementPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const {
        configs, activities, audits, servicesList, loading,
        totalConfigs, totalActivities, totalAudits,
        fetchConfigs, fetchActivities, fetchAudits, fetchServices, submitConfig, deleteConfig
    } = useSystemLogs();

    // UI States
    const [activeTab, setActiveTab] = useState("configs");
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<any>(null);
    const [configForm, setConfigForm] = useState({
        serviceName: '', scope: 'ENDPOINT', targetPath: '', method: 'ALL', isActive: true, logPayload: false, logResponse: false, action: ''
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [configToDelete, setConfigToDelete] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [isActivityDetailModalOpen, setIsActivityDetailModalOpen] = useState(false);
    const [activityDetailData, setActivityDetailData] = useState<any>(null);
    const [isAuditDetailModalOpen, setIsAuditDetailModalOpen] = useState(false);
    const [auditDetailData, setAuditDetailData] = useState<any>(null);

    // Table States
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [searchService, setSearchService] = useState('');

    // --- COLUMNS DEFINITIONS ---

    const configColumns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'serviceName',
            header: "Service & Path",
            cell: ({ row }) => (
                <div className="flex flex-col py-1">
                    <span className="font-bold text-xs uppercase text-slate-900">{row.original.serviceName}</span>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">{row.original.targetPath}</span>
                </div>
            )
        },
        {
            accessorKey: 'scope',
            header: "Rules",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[9px] font-mono">{row.original.method}</Badge>
                    <Badge variant="secondary" className="text-[9px] uppercase">{row.original.scope}</Badge>
                    <Badge variant="default" className="text-[9px] uppercase">{row.original.action}</Badge>
                </div>
            )
        },
        {
            accessorKey: 'isActive',
            header: "Status",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <Badge className={row.original.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}>
                        {row.original.isActive ? 'ACTIVE' : 'OFF'}
                    </Badge>
                </div>
            )
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Kelola</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreHorizontal size={14} /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setDetailData(row.original); setIsDetailModalOpen(true); }}>
                                <Eye className="w-3.5 h-3.5 mr-2" /> Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openConfigModal(row.original)}>
                                <Edit2 className="w-3.5 h-3.5 mr-2 text-blue-600" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setConfigToDelete(row.original); setIsDeleteModalOpen(true); }} className="text-red-600">
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ], []);

    const activityColumns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'timestamp',
            header: "Waktu",
            cell: ({ row }) => (
                <div className="flex flex-col py-1 text-[11px]">
                    <span className="font-bold">{new Date(row.original.timestamp).toLocaleDateString('id-ID')}</span>
                    <span className="text-slate-400 font-mono flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(row.original.timestamp).toLocaleTimeString('id-ID')}</span>
                </div>
            )
        },
        {
            accessorKey: 'endpoint',
            header: "Endpoint & Traffic",
            cell: ({ row }) => (
                <div className="flex flex-col py-1 gap-1 max-w-[250px]">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-black">{row.original.method}</Badge>
                        <span className="text-xs font-mono font-medium truncate text-blue-700">{row.original.endpoint}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{row.original.serviceOrigin} • {row.original.username || 'System'}</span>
                </div>
            )
        },
        {
            accessorKey: 'httpStatus',
            header: "Status",
            cell: ({ row }) => (
                <div className="flex flex-col items-start gap-1">
                    <Badge className={row.original.httpStatus < 400 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}>
                        {row.original.httpStatus}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-400">{row.original.durationMs}ms</span>
                </div>
            )
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setActivityDetailData(row.original); setIsActivityDetailModalOpen(true); }} className="h-8 text-[10px] font-bold border border-slate-200">
                        <Search size={14} className="mr-1" /> Inspect
                    </Button>
                </div>
            )
        }
    ], []);

    const auditColumns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'createdAt',
            header: "Timestamp",
            cell: ({ row }) => (
                <div className="flex flex-col text-[11px]">
                    <span className="font-bold">{new Date(row.original.createdAt).toLocaleDateString('id-ID')}</span>
                    <span className="text-slate-400 font-mono">{new Date(row.original.createdAt).toLocaleTimeString('id-ID')}</span>
                </div>
            )
        },
        {
            accessorKey: 'tableName',
            header: "Table & ID",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase flex items-center gap-1.5"><Database className="w-3 h-3 text-blue-500" /> {row.original.tableName}</span>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {row.original.recordId}</span>
                </div>
            )
        },
        {
            accessorKey: 'dbOperation',
            header: "Op",
            cell: ({ row }) => (
                <Badge className={row.original.dbOperation === 'INSERT' ? 'bg-emerald-500' : row.original.dbOperation === 'UPDATE' ? 'bg-amber-500' : 'bg-rose-500'}>
                    {row.original.dbOperation}
                </Badge>
            )
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Inspect</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setAuditDetailData(row.original); setIsAuditDetailModalOpen(true); }} className="h-8 text-[10px] font-bold border border-slate-200">
                        <Eye size={14} className="mr-1" /> Diff
                    </Button>
                </div>
            )
        }
    ], []);

    // --- TABLE HOOKS SETUP ---

    const currentColumns = useMemo(() => {
        if (activeTab === "configs") return configColumns;
        if (activeTab === "activities") return activityColumns;
        return auditColumns;
    }, [activeTab, configColumns, activityColumns, auditColumns]);

    const currentTableData = useMemo(() => {
        if (activeTab === "configs") return configs;
        if (activeTab === "activities") return activities;
        return audits;
    }, [activeTab, configs, activities, audits]);

    const currentTotal = useMemo(() => {
        if (activeTab === "configs") return totalConfigs;
        if (activeTab === "activities") return totalActivities;
        return totalAudits;
    }, [activeTab, totalConfigs, totalActivities, totalAudits]);

    const table = useReactTable({
        data: currentTableData || [],
        columns: currentColumns,
        pageCount: Math.ceil((currentTotal || 0) / pagination.pageSize),
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    // --- SIDE EFFECTS (API CALLS) ---

    useEffect(() => {
        const page = pagination.pageIndex + 1;
        const limit = pagination.pageSize;
        const load = () => {
            if (activeTab === "configs") fetchConfigs(page, globalFilter, limit);
            if (activeTab === "activities") fetchActivities(page, globalFilter, limit);
            if (activeTab === "audits") fetchAudits(page, globalFilter, limit);
        };
        const timer = setTimeout(load, 400);
        return () => clearTimeout(timer);
    }, [activeTab, pagination.pageIndex, globalFilter]);

    useEffect(() => {
        fetchServices();
    }, []);

    // --- EVENT HANDLERS ---

    const openConfigModal = (data: any = null) => {
        if (!isAdmin) return;
        setSelectedConfig(data);
        setConfigForm(data ? { ...data } : {
            serviceName: '', scope: 'ENDPOINT', targetPath: '', method: 'ALL', isActive: true, logPayload: false, logResponse: false, action: 'ALL'
        });
        setIsConfigModalOpen(true);
    };

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        const action = selectedConfig ? 'UPDATE' : 'CREATE';
        const success = await submitConfig(action, configForm, selectedConfig?.id);
        if (success) {
            setIsConfigModalOpen(false);
            fetchConfigs(pagination.pageIndex + 1, globalFilter);
        }
    };

    const confirmDeleteConfig = async () => {
        if (configToDelete) {
            const success = await deleteConfig(configToDelete.id);
            if (success) {
                setIsDeleteModalOpen(false);
                fetchConfigs(pagination.pageIndex + 1, globalFilter);
            }
        }
    };

    if (!isAdmin) return <div className="p-20 text-center font-bold text-red-500 italic">Access Denied: Admin Level Required.</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-2">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 uppercase">
                        <Activity className="text-indigo-600" /> System Logging
                    </h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Monitor & Audit System Data</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari data log..."
                            className="pl-9 rounded-xl border-slate-200 text-xs"
                            value={globalFilter}
                            onChange={(e) => { setGlobalFilter(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })); }}
                        />
                    </div>
                    {activeTab === "configs" && (
                        <Button onClick={() => openConfigModal()} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold shadow-lg shadow-indigo-100 h-10 uppercase text-[10px] tracking-widest px-4">
                            <PlusSquare className="w-4 h-4 mr-2" /> Tambah Config
                        </Button>
                    )}
                </div>
            </div>

            {/* --- TAB NAVIGATION --- */}
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPagination(p => ({ ...p, pageIndex: 0 })); }} className="w-full space-y-6">
                <TabsList className="bg-slate-100 p-1.5 rounded-2xl w-fit h-auto border border-slate-200">
                    <TabsTrigger value="configs" className="gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Settings size={14} /> Configs
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Activity size={14} /> Log Aktifitas
                    </TabsTrigger>
                    <TabsTrigger value="audits" className="gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Database size={14} /> Log Audit
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0 outline-none">
                    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                {table.getHeaderGroups().map(hg => (
                                    <TableRow key={hg.id} className="hover:bg-transparent">
                                        {hg.headers.map(header => (
                                            <TableHead key={header.id} className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={currentColumns.length} className="h-64 text-center">
                                            <Loader2 className="animate-spin text-indigo-600 w-8 h-8 mx-auto" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 animate-pulse">Syncing Data...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell key={cell.id} className="px-6 py-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={currentColumns.length} className="h-64 text-center opacity-40 italic text-xs uppercase font-bold tracking-widest">
                                            Tidak ada data untuk ditampilkan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* --- PAGINATION FOOTER --- */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Total {currentTotal} Data</span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded-lg h-8 w-8 p-0 border-slate-200 hover:bg-white transition-all"><ChevronLeft size={16} /></Button>
                                <span className="text-[10px] font-black text-slate-600 px-2">{pagination.pageIndex + 1} / {table.getPageCount() || 1}</span>
                                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-lg h-8 w-8 p-0 border-slate-200 hover:bg-white transition-all"><ChevronRight size={16} /></Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* CONFIG CREATE/EDIT MODAL */}
            <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
                <DialogContent className="sm:max-w-xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-indigo-600 p-8 text-white flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight leading-none">Configs Manager</DialogTitle>
                            <p className="text-indigo-100 text-[10px] mt-2 font-black uppercase tracking-widest opacity-80">Define Logging Configurations</p>
                        </div>
                        <Settings className="w-12 h-12 text-white/20 -rotate-12" />
                    </div>
                    <form onSubmit={handleSaveConfig} className="p-8 space-y-5 bg-white">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Service Origin</Label>
                                <Select value={configForm.serviceName} onValueChange={v => setConfigForm({ ...configForm, serviceName: v })}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs"><SelectValue placeholder="Pilih Service" /></SelectTrigger>
                                    <SelectContent>
                                        <div className="px-2 py-2 sticky top-0 bg-white z-10 border-b">
                                            <Input placeholder="Cari..." className="h-8 text-xs" value={searchService} onChange={e => setSearchService(e.target.value)} onKeyDown={e => e.stopPropagation()} />
                                        </div>
                                        {servicesList?.filter(s => s.name.toLowerCase().includes(searchService.toLowerCase())).map(s => (
                                            <SelectItem key={s.id} value={s.name} className="font-bold text-xs">{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Method</Label>
                                <Select value={configForm.method} onValueChange={v => setConfigForm({ ...configForm, method: v })}>
                                    <SelectTrigger className="h-11 w-full rounded-xl bg-slate-50 border-none font-mono text-xs font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <SelectItem key={m} value={m} className="font-mono text-xs font-bold">{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Scope</Label>
                                <Select value={configForm.scope} onValueChange={v => setConfigForm({ ...configForm, scope: v })}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-mono text-xs font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['GLOBAL', 'ENDPOINT', 'PAGE'].map(m => <SelectItem key={m} value={m} className="font-mono text-xs font-bold">{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Action</Label>
                                <Input placeholder="GET_ALL*" className="h-11 rounded-xl bg-slate-50 border-none font-mono text-xs font-bold" value={configForm.action} onChange={e => setConfigForm({ ...configForm, action: e.target.value })} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase ml-1">Target API Path</Label>
                            <Input placeholder="/api/v1/resource/*" className="h-11 rounded-xl bg-slate-50 border-none font-mono text-xs font-bold" value={configForm.targetPath} onChange={e => setConfigForm({ ...configForm, targetPath: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <Checkbox id="payload" checked={configForm.logPayload} onCheckedChange={v => setConfigForm({ ...configForm, logPayload: !!v })} />
                                <Label htmlFor="payload" className="text-[11px] font-black uppercase text-slate-600 cursor-pointer tracking-tight">Payload (Body)</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox id="response" checked={configForm.logResponse} onCheckedChange={v => setConfigForm({ ...configForm, logResponse: !!v })} />
                                <Label htmlFor="response" className="text-[11px] font-black uppercase text-slate-600 cursor-pointer tracking-tight">Server Response</Label>
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-indigo-600 uppercase font-black tracking-widest shadow-xl active:scale-95 transition-all">
                            {loading ? <Loader2 className="animate-spin" /> : 'Apply Configuration'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIG MODAL */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md rounded-[2rem] p-8 border-none shadow-2xl text-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-rose-500" size={32} />
                    </div>
                    <DialogTitle className="text-xl font-bold">Remove Rule?</DialogTitle>
                    <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider leading-relaxed">
                        Rule for <span className="font-mono font-bold text-rose-600">{configToDelete?.targetPath}</span> will be deleted.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-8">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl font-bold uppercase text-[10px] tracking-widest h-11">Abort</Button>
                        <Button onClick={confirmDeleteConfig} className="bg-rose-600 hover:bg-rose-700 rounded-xl font-bold uppercase text-[10px] tracking-widest h-11 text-white" disabled={loading}>Delete</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* INSPECTION MODAL (UNIFIED VIEWER FOR ALL LOGS) */}
            <Dialog open={isDetailModalOpen || isActivityDetailModalOpen || isAuditDetailModalOpen}
                onOpenChange={(v) => {
                    if (!v) {
                        setIsDetailModalOpen(false);
                        setIsActivityDetailModalOpen(false);
                        setIsAuditDetailModalOpen(false);
                    }
                }}>
                <DialogContent className="sm:max-w-5xl max-h-[85vh] rounded-[2.5rem] overflow-hidden p-0 flex flex-col border-none shadow-2xl">
                    <div className="bg-slate-900 p-8 text-white shrink-0">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Badge className="bg-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">Data Inspector</Badge>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter truncate max-w-2xl font-mono">
                                    {detailData?.targetPath || activityDetailData?.endpoint || `Table: ${auditDetailData?.tableName}`}
                                </DialogTitle>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Column 1: Context or Old Data */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    {auditDetailData ? 'Previous State (Before)' : 'Context / Headers / Config'}
                                </p>
                                <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 shadow-2xl h-[400px] overflow-auto custom-scrollbar">
                                    <pre className="text-[11px] font-mono text-emerald-400/90 leading-relaxed">
                                        {JSON.stringify(detailData || activityDetailData?.requestData || auditDetailData?.oldData, null, 2)}
                                    </pre>
                                </div>
                            </div>

                            {/* Column 2: Response or New Data */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    {auditDetailData ? 'Result State (After)' : 'Server Result / Body'}
                                </p>
                                <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 shadow-2xl h-[400px] overflow-auto custom-scrollbar">
                                    <pre className="text-[11px] font-mono text-blue-400/90 leading-relaxed">
                                        {JSON.stringify(activityDetailData?.responseData || auditDetailData?.newData || { msg: "No body data available" }, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="bg-white p-4 border-t px-8 shrink-0 flex items-center justify-between">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest truncate max-w-md">
                            Correlation ID: {(detailData || activityDetailData || auditDetailData)?.correlationId || 'N/A'}
                        </div>
                        <Button variant="outline" onClick={() => { setIsDetailModalOpen(false); setIsActivityDetailModalOpen(false); setIsAuditDetailModalOpen(false); }} className="font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl px-6 h-9">Close Inspector</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}