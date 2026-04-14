import {
  DndContext, DragOverlay, PointerSensor, TouchSensor,
  useSensor, useSensors, closestCenter,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState, useRef, useCallback } from 'react'
import { LeftSidebar } from './LeftSidebar'
import { CenterMap } from './CenterMap'
import { RightPanel } from './RightPanel'
import { AddLocationModal } from '../modal/AddLocationModal'
import { TransportModal } from '../modal/TransportModal'
import { CategoryIcon } from '../shared/CategoryIcon'
import { getCountryStyle } from '../../utils/colorMap'
import useTripStore from '../../store/useTripStore'

function DragOverlayCard({ attraction }) {
  const style = getCountryStyle(attraction.countryCode)
  return (
    <div
      style={{ borderLeftColor: style.hex }}
      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 border-l-[3px] rounded-lg px-3 py-2 flex items-center gap-2 shadow-2xl opacity-90 pointer-events-none"
    >
      <CategoryIcon category={attraction.category} />
      <span className="text-sm font-semibold text-slate-900 dark:text-white">{attraction.name}</span>
    </div>
  )
}

export function AppShell() {
  const { itinerary, addToDay, moveStop } = useTripStore()
  const activeTab          = useTripStore(s => s.activeTab)
  const setActiveTab       = useTripStore(s => s.setActiveTab)
  const leftVisible        = useTripStore(s => s.leftSidebarVisible)
  const rightVisible       = useTripStore(s => s.rightSidebarVisible)
  const toggleLeft         = useTripStore(s => s.toggleLeftSidebar)
  const toggleRight        = useTripStore(s => s.toggleRightSidebar)
  const showAddModal       = useTripStore(s => s.showAddModal)
  const showTransportModal = useTripStore(s => s.showTransportModal)

  // Sidebar widths (local state — not persisted)
  const [leftWidth, setLeftWidth]   = useState(320)
  const [rightWidth, setRightWidth] = useState(400)

  const [draggedAttraction, setDraggedAttraction] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  // ── Resize drag handlers ──
  const startResize = useCallback((side, e) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = side === 'left' ? leftWidth : rightWidth

    function onMove(me) {
      const delta = side === 'left'
        ? me.clientX - startX
        : startX - me.clientX
      const next = Math.max(220, Math.min(520, startW + delta))
      side === 'left' ? setLeftWidth(next) : setRightWidth(next)
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [leftWidth, rightWidth])

  // ── DnD handlers ──
  function handleDragStart(event) {
    const { data } = event.active
    if (data.current?.attraction) setDraggedAttraction(data.current.attraction)
  }
  function handleDragEnd(event) {
    setDraggedAttraction(null)
    const { active, over } = event
    if (!over) return
    const activeData = active.data.current
    const overData   = over.data.current

    if (activeData?.type === 'sidebar') {
      let targetDay = null
      if (overData?.type === 'day')  targetDay = overData.dayIndex
      if (overData?.type === 'stop') targetDay = overData.dayIndex
      if (targetDay !== null) addToDay(activeData.attraction, targetDay)
      return
    }
    if (activeData?.type === 'stop') {
      const fromDay     = activeData.dayIndex
      const attractionId = activeData.attraction.id
      let toDay = null, newIndex = 0
      if (overData?.type === 'day')  { toDay = overData.dayIndex; newIndex = (itinerary[toDay] ?? []).length }
      if (overData?.type === 'stop') { toDay = overData.dayIndex; newIndex = overData.stopIndex }
      if (toDay === null) return
      if (fromDay === toDay) {
        const stops    = [...(itinerary[fromDay] ?? [])]
        const oldIndex = stops.findIndex(s => s.id === attractionId)
        const newIdx   = overData?.stopIndex ?? stops.length - 1
        if (oldIndex !== newIdx) {
          useTripStore.setState(state => ({
            itinerary: { ...state.itinerary, [fromDay]: arrayMove(stops, oldIndex, newIdx) }
          }))
        }
      } else {
        moveStop(attractionId, fromDay, toDay, newIndex)
      }
    }
  }

  const gridCols = [
    leftVisible  ? `${leftWidth}px`  : '0px',
    '1fr',
    rightVisible ? `${rightWidth}px` : '0px',
  ].join(' ')

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex h-screen bg-gray-100 dark:bg-slate-950 overflow-hidden"
        style={{ display: 'none' }} /* fallback, overridden below */ />
      <div
        className="hidden lg:grid h-screen overflow-hidden"
        style={{ gridTemplateColumns: gridCols }}
      >
        {/* Left sidebar — collapses to 0 width */}
        <div className={`relative overflow-hidden transition-all duration-300 ${leftVisible ? '' : 'pointer-events-none'}`}>
          {leftVisible && <LeftSidebar />}

          {/* Right-edge resize handle */}
          {leftVisible && (
            <div
              onMouseDown={e => startResize('left', e)}
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-400/40 transition-colors z-10 group"
              title="Drag to resize"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-gray-300 dark:bg-slate-600 group-hover:bg-blue-400 transition-colors" />
            </div>
          )}
        </div>

        {/* Center map */}
        <CenterMap leftWidth={leftWidth} rightWidth={rightWidth} />

        {/* Right panel — collapses to 0 width */}
        <div className={`relative overflow-hidden transition-all duration-300 ${rightVisible ? '' : 'pointer-events-none'}`}>
          {/* Left-edge resize handle */}
          {rightVisible && (
            <div
              onMouseDown={e => startResize('right', e)}
              className="absolute top-0 left-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-400/40 transition-colors z-10 group"
              title="Drag to resize"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-gray-300 dark:bg-slate-600 group-hover:bg-blue-400 transition-colors" />
            </div>
          )}
          {rightVisible && <RightPanel />}
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="lg:hidden flex flex-col h-screen bg-gray-100 dark:bg-slate-900">
        <div className="flex-1 overflow-hidden">
          {activeTab === 'explore'   && <LeftSidebar />}
          {activeTab === 'map'       && <CenterMap />}
          {activeTab === 'itinerary' && <RightPanel />}
        </div>
        <div className="flex border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
          {[
            { id: 'explore', icon: '🔍', label: 'Explore' },
            { id: 'map',     icon: '🗺️', label: 'Map' },
            { id: 'itinerary', icon: '📅', label: 'Plan' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs transition-colors ${
                activeTab === tab.id ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
              }`}>
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar toggle tabs — overlaid on map edges */}
      <SidebarToggleTabs
        leftVisible={leftVisible}  toggleLeft={toggleLeft}
        rightVisible={rightVisible} toggleRight={toggleRight}
      />

      {/* Modals */}
      {showAddModal       && <AddLocationModal />}
      {showTransportModal && <TransportModal />}

      <DragOverlay>
        {draggedAttraction && <DragOverlayCard attraction={draggedAttraction} />}
      </DragOverlay>
    </DndContext>
  )
}

// Small tab-shaped toggle buttons that sit on the edges of the map
function SidebarToggleTabs({ leftVisible, toggleLeft, rightVisible, toggleRight }) {
  const btnCls = `hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-[1000] w-5 h-14 rounded text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all hover:scale-105 text-xs select-none`

  return (
    <>
      {/* Left toggle — sits on map's left edge */}
      <button
        onClick={toggleLeft}
        title={leftVisible ? 'Hide sidebar' : 'Show sidebar'}
        className={`${btnCls}`}
        style={{
          // Position relative to viewport: just inside the left panel boundary
          position: 'fixed',
          left: leftVisible ? 'calc(var(--left-w, 320px) - 10px)' : '0px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {leftVisible ? '‹' : '›'}
      </button>

      {/* Right toggle — sits on map's right edge */}
      <button
        onClick={toggleRight}
        title={rightVisible ? 'Hide panel' : 'Show panel'}
        className={`${btnCls}`}
        style={{
          position: 'fixed',
          right: rightVisible ? 'calc(var(--right-w, 400px) - 10px)' : '0px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {rightVisible ? '›' : '‹'}
      </button>
    </>
  )
}
