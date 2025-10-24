// /scripts/moveable.js

// ################################ //
// Item dragging and deleting logic //
// ################################ //
class ItemDragManager {
  constructor() {
    this.currentlyDraggedItem = null;
    this.dragStartOffset = { x: 0, y: 0 };
    this.placeholder = null;
    this.originalIndex = null;
    this.container = null;
    this.isItemBeingDragged = false;
    this.snapThreshold = 60;
    this.animationFrame = null;
    this.itemWidth = 0;
    this.itemHeight = 0;
    this.dragStartTime = 0;
    this.dragStartPosition = { x: 0, y: 0 };
    this.currentTargetIndex = -1;
    this.lastSnapTime = 0;
    this.snapCooldown = 100;
    this.deletedItems = new Map();
    this.floatingDeleteZone = null;
    this.isOverDeleteZone = false;
    this.isTouchCapableDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    this.touchDragTimeout = null;
    this.isPotentialDragAction = false;
    this.initialTouchElement = null;
    this.scrollDisabled = false;

    this.init();
  }

  init() {
    this.setupContainers();
    this.createDragDeleteZone();
    this.attachDragEventListeners();
  }

  setupContainers() {
    const containerSelectors = [
      "#achievements .achievements-grid",
      "#projects .projects-grid",
      "#micro-projects .projects-grid",
      "#private-projects .projects-grid",
      "#project-ideas .projects-grid",
      "#tech-stack .tech-grid",
    ];

    containerSelectors.forEach((selector) => {
      const container = document.querySelector(selector);
      if (container) {
        this.enableContainerDragDrop(container);
        this.deletedItems.set(container, []);
      }
    });
  }

  enableContainerDragDrop(container) {
    container.classList.add("draggable-container", "draggable-grid");

    const items = container.children;
    [...items].forEach((item, index) => {
      item.classList.add("draggable-item");
      if (!item.dataset.originalIndex) {
        item.dataset.originalIndex = index;
      }
    });
  }

  createDragDeleteZone() {
    this.floatingDeleteZone = document.createElement("div");
    this.floatingDeleteZone.className = "floating-delete-zone";
    this.floatingDeleteZone.innerHTML = `<i class="fas fa-trash"></i>`;
    document.body.appendChild(this.floatingDeleteZone);

    this.floatingDeleteZone.addEventListener("click", () => {
      if (this.isItemBeingDragged && this.currentlyDraggedItem) {
        this.removeDraggedItem();
      }
    });
  }

  attachDragEventListeners() {
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    if (this.isTouchCapableDevice) {
      document.addEventListener(
        "touchstart",
        this.handleTouchStart.bind(this),
        {
          passive: true,
        }
      );
      document.addEventListener("touchmove", this.handleTouchMove.bind(this), {
        passive: false,
      });
      document.addEventListener("touchend", this.handleTouchEnd.bind(this));
      document.addEventListener("touchcancel", this.handleTouchEnd.bind(this));
    } else {
      document.addEventListener(
        "touchstart",
        this.handleTouchStart.bind(this),
        {
          passive: false,
        }
      );
      document.addEventListener("touchmove", this.handleTouchMove.bind(this), {
        passive: false,
      });
      document.addEventListener("touchend", this.handleTouchEnd.bind(this));
    }

    document.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("selectstart", this.handleSelectStart.bind(this));

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  preventPageScroll() {
    if (!this.scrollDisabled) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      this.scrollDisabled = true;
    }
  }

  restorePageScroll() {
    if (this.scrollDisabled) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      this.scrollDisabled = false;
    }
  }

  handleSelectStart(e) {
    if (e.target.closest(".draggable-item")) {
      e.preventDefault();
    }
  }

  handleKeyDown(e) {
    if (!this.isItemBeingDragged || !this.currentlyDraggedItem) return;

    const deleteKeys = ["Escape", "Delete", "Backspace"];
    if (deleteKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      this.removeDraggedItem();
    }
  }

  removeDraggedItem() {
    if (!this.currentlyDraggedItem || !this.container) return;

    const deletedItem = {
      element: this.currentlyDraggedItem,
      originalIndex: this.originalIndex,
      container: this.container,
    };

    const containerDeletedItems = this.deletedItems.get(this.container) || [];
    containerDeletedItems.push(deletedItem);
    this.deletedItems.set(this.container, containerDeletedItems);

    this.createDeletedItemMarker();
    this.currentlyDraggedItem.remove();
    this.resetDragState();
  }

  createDeletedItemMarker() {
    if (!this.placeholder) return;

    const permanentPlaceholder = this.placeholder;
    permanentPlaceholder.classList.add("permanent-deleted");
    permanentPlaceholder.style.opacity = "0.4";
    permanentPlaceholder.style.background = "rgba(255, 59, 48, 0.1)";
    permanentPlaceholder.style.border = "2px dashed var(--accent-red)";
    permanentPlaceholder.innerHTML = `
      <div style="text-align: center; color: var(--accent-red);">
        <i class="fas fa-trash" style="font-size: 1.5em; margin-bottom: 0.5rem;"></i>
        <div style="font-size: 0.8em;">Deleted</div>
      </div>
    `;

    permanentPlaceholder.addEventListener("click", () => {
      this.restoreRecentlyDeletedItem(this.container);
    });

    permanentPlaceholder.classList.add("draggable-item");
    permanentPlaceholder.dataset.originalIndex = this.originalIndex;

    this.placeholder = null;
  }

  restoreRecentlyDeletedItem(container) {
    const containerDeletedItems = this.deletedItems.get(container) || [];
    if (containerDeletedItems.length === 0) return;

    const lastDeleted = containerDeletedItems.pop();
    this.deletedItems.set(container, containerDeletedItems);

    if (lastDeleted && lastDeleted.element) {
      const permanentPlaceholders =
        container.querySelectorAll(".permanent-deleted");
      permanentPlaceholders.forEach((placeholder) => {
        placeholder.remove();
      });

      const currentItems = Array.from(container.children).filter(
        (item) => !item.classList.contains("permanent-deleted")
      );
      let insertIndex = Math.min(
        lastDeleted.originalIndex,
        currentItems.length
      );

      if (currentItems.length === 0) {
        container.appendChild(lastDeleted.element);
      } else {
        container.insertBefore(lastDeleted.element, currentItems[insertIndex]);
      }

      lastDeleted.element.classList.add("draggable-item");
      this.triggerScrollAnimations();
    }
  }

  initGlobalRestore() {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        this.restoreAllRemovedItems();
      }
    });
  }

  restoreAllRemovedItems() {
    let restoredCount = 0;

    this.deletedItems.forEach((deletedItems, container) => {
      if (deletedItems.length > 0) {
        const itemsToRestore = [...deletedItems].reverse();
        itemsToRestore.forEach((item) => {
          if (item && item.element) {
            const permanentPlaceholders =
              container.querySelectorAll(".permanent-deleted");
            permanentPlaceholders.forEach((placeholder) => {
              placeholder.remove();
            });

            const currentItems = Array.from(container.children).filter(
              (item) => !item.classList.contains("permanent-deleted")
            );
            let insertIndex = Math.min(item.originalIndex, currentItems.length);

            if (currentItems.length === 0) {
              container.appendChild(item.element);
            } else {
              const targetIndex = Math.min(insertIndex, currentItems.length);
              container.insertBefore(item.element, currentItems[targetIndex]);
            }

            item.element.classList.add("draggable-item");
            restoredCount++;
          }
        });

        this.deletedItems.set(container, []);
      }
    });

    if (restoredCount > 0) {
      this.triggerScrollAnimations();
    }
  }

  handleMouseDown(e) {
    if (!e.target.closest(".draggable-item")) return;

    const item = e.target.closest(".draggable-item");
    if (item.classList.contains("permanent-deleted")) {
      this.restoreRecentlyDeletedItem(item.parentElement);
      return;
    }

    this.dragStartTime = Date.now();
    this.dragStartPosition = { x: e.clientX, y: e.clientY };

    this.dragTimeout = setTimeout(() => {
      this.initiateItemDrag(item, e.clientX, e.clientY);
    }, 150);

    e.preventDefault();
  }

  handleTouchStart(e) {
    if (!e.target.closest(".draggable-item")) return;

    const touch = e.touches[0];
    const item = e.target.closest(".draggable-item");

    if (item.classList.contains("permanent-deleted")) {
      this.restoreRecentlyDeletedItem(item.parentElement);
      return;
    }

    this.initialTouchElement = item;
    this.dragStartTime = Date.now();
    this.dragStartPosition = { x: touch.clientX, y: touch.clientY };

    if (this.isTouchCapableDevice) {
      this.isPotentialDragAction = true;

      if (this.touchDragTimeout) {
        clearTimeout(this.touchDragTimeout);
      }

      this.touchDragTimeout = setTimeout(() => {
        if (this.isPotentialDragAction && this.initialTouchElement) {
          this.initiateItemDrag(
            this.initialTouchElement,
            touch.clientX,
            touch.clientY
          );
          this.isPotentialDragAction = false;
        }
      }, 500);
    } else {
      this.dragTimeout = setTimeout(() => {
        this.initiateItemDrag(item, touch.clientX, touch.clientY);
      }, 200);
    }

    if (!this.isTouchCapableDevice) {
      e.preventDefault();
    }
  }

  initiateItemDrag(item, clientX, clientY) {
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }

    if (this.touchDragTimeout) {
      clearTimeout(this.touchDragTimeout);
      this.touchDragTimeout = null;
    }

    this.currentlyDraggedItem = item;
    this.container = item.parentElement;
    this.isItemBeingDragged = true;

    this.floatingDeleteZone.classList.add("visible");

    const originalTransform = item.style.transform;
    item.style.transform = "";

    const rect = item.getBoundingClientRect();
    this.itemWidth = rect.width;
    this.itemHeight = rect.height;

    item.style.transform = originalTransform;

    this.dragStartOffset.x = clientX - rect.left;
    this.dragStartOffset.y = clientY - rect.top;

    this.originalIndex = Array.from(this.container.children).indexOf(item);
    this.currentTargetIndex = this.originalIndex;

    this.createDragPlaceholder();
    item.classList.add("dragging");
    this.updateItemPosition(clientX, clientY);

    if (this.isTouchCapableDevice) {
      this.preventPageScroll();
    }

    setTimeout(() => {
      if (this.placeholder) {
        this.placeholder.style.opacity = "0.4";
      }
    }, 100);
  }

  createDragPlaceholder() {
    this.placeholder = document.createElement("div");
    this.placeholder.classList.add("draggable-item", "placeholder");

    this.placeholder.style.width = `${this.itemWidth}px`;
    this.placeholder.style.height = `${this.itemHeight}px`;
    this.placeholder.style.opacity = "0";

    this.container.insertBefore(this.placeholder, this.currentlyDraggedItem);
  }

  handleMouseMove(e) {
    if (this.dragTimeout && !this.isItemBeingDragged) {
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - this.dragStartPosition.x, 2) +
          Math.pow(e.clientY - this.dragStartPosition.y, 2)
      );

      if (moveDistance > 10) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
        return;
      }
    }

    if (!this.isItemBeingDragged) return;

    const deleteZoneRect = this.floatingDeleteZone.getBoundingClientRect();
    const isOverDeleteZone =
      e.clientX >= deleteZoneRect.left &&
      e.clientX <= deleteZoneRect.right &&
      e.clientY >= deleteZoneRect.top &&
      e.clientY <= deleteZoneRect.bottom;

    if (isOverDeleteZone && !this.isOverDeleteZone) {
      this.isOverDeleteZone = true;
      this.floatingDeleteZone.classList.add("active");
    } else if (!isOverDeleteZone && this.isOverDeleteZone) {
      this.isOverDeleteZone = false;
      this.floatingDeleteZone.classList.remove("active");
    }

    this.updateDragPosition(e.clientX, e.clientY);
    e.preventDefault();
  }

  handleTouchMove(e) {
    if (this.isPotentialDragAction && !this.isItemBeingDragged) {
      const touch = e.touches[0];
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - this.dragStartPosition.x, 2) +
          Math.pow(touch.clientY - this.dragStartPosition.y, 2)
      );

      if (moveDistance > 15) {
        this.isPotentialDragAction = false;
        if (this.touchDragTimeout) {
          clearTimeout(this.touchDragTimeout);
          this.touchDragTimeout = null;
        }
        return;
      }

      e.preventDefault();
      return;
    }

    if (!this.isItemBeingDragged) return;

    const touch = e.touches[0];

    const deleteZoneRect = this.floatingDeleteZone.getBoundingClientRect();
    const isOverDeleteZone =
      touch.clientX >= deleteZoneRect.left &&
      touch.clientX <= deleteZoneRect.right &&
      touch.clientY >= deleteZoneRect.top &&
      touch.clientY <= deleteZoneRect.bottom;

    if (isOverDeleteZone && !this.isOverDeleteZone) {
      this.isOverDeleteZone = true;
      this.floatingDeleteZone.classList.add("active");
    } else if (!isOverDeleteZone && this.isOverDeleteZone) {
      this.isOverDeleteZone = false;
      this.floatingDeleteZone.classList.remove("active");
    }

    this.updateDragPosition(touch.clientX, touch.clientY);
    e.preventDefault();
  }

  updateDragPosition(clientX, clientY) {
    if (!this.currentlyDraggedItem || !this.isItemBeingDragged) return;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.updateItemPosition(clientX, clientY);
      this.reorderItemsOnDrag();
    });
  }

  updateItemPosition(clientX, clientY) {
    const x = clientX - this.dragStartOffset.x;
    const y = clientY - this.dragStartOffset.y;

    this.currentlyDraggedItem.style.position = "fixed";
    this.currentlyDraggedItem.style.left = `${x}px`;
    this.currentlyDraggedItem.style.top = `${y}px`;
    this.currentlyDraggedItem.style.zIndex = "1000";
    this.currentlyDraggedItem.style.width = `${this.itemWidth}px`;
    this.currentlyDraggedItem.style.height = `${this.itemHeight}px`;
    this.currentlyDraggedItem.style.transform = "none";
    this.currentlyDraggedItem.style.willChange = "transform";
  }

  reorderItemsOnDrag() {
    if (!this.currentlyDraggedItem || !this.placeholder) return;

    const draggedRect = this.currentlyDraggedItem.getBoundingClientRect();
    const items = Array.from(this.container.children).filter(
      (child) =>
        child !== this.currentlyDraggedItem && child !== this.placeholder
    );

    let targetItem = null;

    for (const item of items) {
      const itemRect = item.getBoundingClientRect();

      const overlapLeft = Math.max(draggedRect.left, itemRect.left);
      const overlapRight = Math.min(draggedRect.right, itemRect.right);
      const overlapTop = Math.max(draggedRect.top, itemRect.top);
      const overlapBottom = Math.min(draggedRect.bottom, itemRect.bottom);

      if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
        const overlapWidth = overlapRight - overlapLeft;
        const overlapHeight = overlapBottom - overlapTop;
        const overlapArea = overlapWidth * overlapHeight;

        const itemArea = itemRect.width * itemRect.height;
        const overlapPercentage = (overlapArea / itemArea) * 100;

        if (overlapPercentage >= 50) {
          targetItem = item;
          break;
        }
      }
    }

    if (targetItem) {
      const draggedIndex = this.originalIndex;
      const targetIndex = Array.from(this.container.children).indexOf(
        targetItem
      );

      if (draggedIndex !== targetIndex) {
        this.placeholder.remove();

        this.container.insertBefore(
          targetItem,
          this.container.children[draggedIndex]
        );

        this.container.insertBefore(
          this.placeholder,
          this.container.children[targetIndex]
        );

        this.originalIndex = targetIndex;
      }
    }

    this.highlightAdjacentDeletedItems(draggedRect);
  }

  highlightAdjacentDeletedItems(draggedRect) {
    this.container.classList.remove("drag-near-deleted");

    const deletedItems = this.container.querySelectorAll(".permanent-deleted");
    let isNearDeleted = false;

    deletedItems.forEach((deletedItem) => {
      const deletedRect = deletedItem.getBoundingClientRect();

      const expandedTop = deletedRect.top - 40;
      const expandedBottom = deletedRect.bottom + 40;
      const expandedLeft = deletedRect.left - 40;
      const expandedRight = deletedRect.right + 40;

      const isNear =
        draggedRect.bottom > expandedTop &&
        draggedRect.top < expandedBottom &&
        draggedRect.right > expandedLeft &&
        draggedRect.left < expandedRight;

      if (isNear) {
        isNearDeleted = true;
        deletedItem.style.borderColor = "var(--accent-light-red)";
        deletedItem.style.background = "rgba(255, 59, 48, 0.2)";
      } else {
        deletedItem.style.borderColor = "";
        deletedItem.style.background = "";
        deletedItem.style.transform = "";
      }
    });

    if (isNearDeleted) {
      this.container.classList.add("drag-near-deleted");
    }
  }

  handleMouseUp(e) {
    this.completeDragOperation();
  }

  handleTouchEnd(e) {
    if (this.isPotentialDragAction && !this.isItemBeingDragged) {
      this.isPotentialDragAction = false;
      if (this.touchDragTimeout) {
        clearTimeout(this.touchDragTimeout);
        this.touchDragTimeout = null;
      }
      this.initialTouchElement = null;
      return;
    }

    this.completeDragOperation();
  }

  completeDragOperation() {
    if (this.isOverDeleteZone && this.currentlyDraggedItem) {
      this.removeDraggedItem();
    } else {
      if (this.dragTimeout) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
      }

      if (this.touchDragTimeout) {
        clearTimeout(this.touchDragTimeout);
        this.touchDragTimeout = null;
      }

      if (!this.isItemBeingDragged) return;

      this.isItemBeingDragged = false;

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      if (this.currentlyDraggedItem && this.placeholder) {
        this.snapItemToGrid();
      } else {
        this.resetDragState();
      }
    }

    if (this.isTouchCapableDevice) {
      this.restorePageScroll();
    }

    this.floatingDeleteZone.classList.remove("visible", "active");
    this.isOverDeleteZone = false;
    this.isPotentialDragAction = false;
    this.initialTouchElement = null;
  }

  snapItemToGrid() {
    if (!this.currentlyDraggedItem || !this.placeholder) return;

    this.container.insertBefore(this.currentlyDraggedItem, this.placeholder);
    this.resetDragState();
    this.persistItemOrder();

    this.triggerScrollAnimations();
  }

  triggerScrollAnimations() {
    const currentScroll = window.pageYOffset;

    window.scrollTo({
      top: currentScroll + 1,
      behavior: "auto",
    });

    requestAnimationFrame(() => {
      window.scrollTo({
        top: currentScroll,
        behavior: "auto",
      });
    });
  }

  resetDragState() {
    if (this.container) {
      this.container.classList.remove("drag-near-deleted");
      const deletedItems =
        this.container.querySelectorAll(".permanent-deleted");
      deletedItems.forEach((item) => {
        item.style.borderColor = "";
        item.style.background = "";
        item.style.transform = "";
      });
    }

    if (this.currentlyDraggedItem) {
      this.currentlyDraggedItem.classList.remove("dragging");
      this.currentlyDraggedItem.style.position = "";
      this.currentlyDraggedItem.style.left = "";
      this.currentlyDraggedItem.style.top = "";
      this.currentlyDraggedItem.style.zIndex = "";
      this.currentlyDraggedItem.style.pointerEvents = "";
      this.currentlyDraggedItem.style.transform = "";
      this.currentlyDraggedItem.style.width = "";
      this.currentlyDraggedItem.style.height = "";
    }

    if (this.placeholder && this.placeholder.parentElement) {
      this.placeholder.parentElement.removeChild(this.placeholder);
    }

    this.currentlyDraggedItem = null;
    this.placeholder = null;
    this.container = null;
    this.animationFrame = null;
    this.itemWidth = 0;
    this.itemHeight = 0;
    this.dragStartTime = 0;
    this.currentTargetIndex = -1;
    this.lastSnapTime = 0;
  }

  persistItemOrder() {
    if (!this.container) return;

    const items = Array.from(this.container.children);
    const order = items.map((item) => item.dataset.originalIndex);
  }

  destroy() {
    document.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("touchstart", this.handleTouchStart);
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchend", this.handleTouchEnd);
    document.removeEventListener("selectstart", this.handleSelectStart);
    document.removeEventListener("keydown", this.handleKeyDown);

    if (this.floatingDeleteZone) {
      this.floatingDeleteZone.remove();
    }

    this.restorePageScroll();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.dragDropManager = new ItemDragManager();
    window.dragDropManager.initGlobalRestore();
  }, 100);
});

