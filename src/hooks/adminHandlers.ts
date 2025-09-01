"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAdminListHandlers<
  IdType extends string | number,
  T extends { id: IdType; status?: boolean }
>(params: {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  itemNameSingular: string;
  routeBase: string;
  actions: Partial<{
    activate: (ids: IdType[]) => Promise<void>;
    deactivate: (ids: IdType[]) => Promise<void>;
    delete: (ids: IdType[]) => Promise<void>;
  }>;
}) {
  const router = useRouter();
  const {
    items,
    setItems,
    itemNameSingular,
    routeBase,
    actions: actionsInput,
  } = params;

  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<IdType[]>([]);

  const activate =
    actionsInput?.activate ?? (async () => { });
  const deactivate =
    actionsInput?.deactivate ?? (async () => { });
  const del =
    actionsInput?.delete ?? (async () => { });

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? items.map((item) => item.id) : []);
  };

  const handleSelectOne = (itemId: IdType, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  };

  const handleEdit = (itemId?: IdType) => {
    const targetId = itemId || (selectedIds.length === 1 ? selectedIds[0] : null);

    if (!targetId) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione um ${itemNameSingular} para editar.`,
      });
      return;
    }

    toast.info("Redirecionando...", {
      description: `Abrindo página de edição do ${itemNameSingular}.`,
    });

    router.push(`${routeBase}/${targetId}/edit`);
  };

  const handleDelete = async (itemId?: IdType) => {
    const targetIds = itemId ? [itemId] : selectedIds;

    if (targetIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para excluir.`,
      });
      return;
    }

    const confirmed = confirm(
      `Tem certeza que deseja excluir ${targetIds.length} ${itemNameSingular}(s)?`
    );
    if (!confirmed) {
      toast.info("Exclusão cancelada.");
      return;
    }

    startTransition(async () => {
      try {
        await del(targetIds);

        setItems(items.filter((item) => !targetIds.includes(item.id)));

        toast.success(
          `${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) excluídos`,
          {
            description: `${targetIds.length} ${itemNameSingular}(s) foram excluídos permanentemente.`,
          }
        );
        setSelectedIds([]);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro inesperado ao deletar.";

        console.error(error);
        toast.error(`Erro ao excluir ${itemNameSingular}(s)`, {
          description: message,
        });
      }
    });
  };

  const handleActivate = async () => {
    if (selectedIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para ativar.`,
      });
      return;
    }

    startTransition(async () => {
      try {
        await activate(selectedIds);
        setItems((prev) =>
          prev.map((item) =>
            selectedIds.includes(item.id) ? { ...item, status: true } : item
          )
        );
        toast.success(
          `${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) ativados com sucesso!`,
          { description: `${selectedIds.length} ${itemNameSingular}(s) foram ativados.` }
        );
        setSelectedIds([]);
      } catch (error) {
        console.error(error);
        toast.error(`Erro ao ativar ${itemNameSingular}(s).`);
      }
    });
  };

  const handleDeactivate = () => {
    if (selectedIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para desativar.`,
      });
      return;
    }

    startTransition(async () => {
      try {
        await deactivate(selectedIds);
        setItems((prev) =>
          prev.map((item) =>
            selectedIds.includes(item.id) ? { ...item, status: false } : item
          )
        );
        toast.warning(
          `${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) desativado(s)`,
          { description: `${selectedIds.length} ${itemNameSingular}(s) foram desativados.` }
        );
        setSelectedIds([]);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro inesperado ao desativar.";

        console.error(error);
        toast.error(`Erro ao desativar ${itemNameSingular}(s).`, {
          description: message,
        });
      }
    });
  };

  return {
    selectedIds,
    isPending,
    handleSelectAll,
    handleSelectOne,
    handleEdit,
    handleDelete,
    handleActivate,
    handleDeactivate,
  };
}
