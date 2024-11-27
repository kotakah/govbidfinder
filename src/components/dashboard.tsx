'use client'

import { useState, useMemo } from 'react'
import { Bell, Search, User, Filter, ChevronDown, Plus, Minus, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface Bid {
  id: number
  title: string
  agency: string
  region: string
  announcementDate: string
  deadline: string
  category: string
}

interface Filter {
  keyword: string
  projectName: string
  organization: string
  region: string
}

interface EmailSettings {
  keywords: string[]
  projectNames: string[]
  organizations: string[]
  regions: string[]
  additionalRecipients: string[]
  enabled: boolean
}

export function DashboardComponent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filter>({
    keyword: '',
    projectName: '',
    organization: '',
    region: '',
  })
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    keywords: [],
    projectNames: [],
    organizations: [],
    regions: [],
    additionalRecipients: [''],
    enabled: true,
  })
  const [favorites, setFavorites] = useState<number[]>([])

  const categories = ['環境', 'IT', '土木', 'AI', 'エネルギー']
  const regions = ['東京都', '大阪府', '愛知県']
  const agencies = ['経済産業省', '総務省', '大阪市', '名古屋市']

  const allBids: Bid[] = [
    {
      id: 1,
      title: 'カーボンニュートラル実現シナリオ構築等に向けた国際連携事業',
      agency: '経済産業省',
      region: '東京都',
      announcementDate: '2024-11-18',
      deadline: '2024-12-15',
      category: '環境'
    },
    {
      id: 2,
      title: '大阪市立図書館システム更新',
      agency: '大阪市',
      region: '大阪府',
      announcementDate: '2024-11-19',
      deadline: '2024-12-20',
      category: 'IT'
    },
    {
      id: 3,
      title: '名古屋市道路補修事業',
      agency: '名古屋市',
      region: '愛知県',
      announcementDate: '2024-11-20',
      deadline: '2024-12-25',
      category: '土木'
    },
    {
      id: 4,
      title: 'AIを活用した防災システム構築',
      agency: '総務省',
      region: '東京都',
      announcementDate: '2024-11-21',
      deadline: '2025-01-10',
      category: 'AI'
    },
    {
      id: 5,
      title: '次世代エネルギー管理システム開発',
      agency: '経済産業省',
      region: '東京都',
      announcementDate: '2024-11-22',
      deadline: '2025-01-15',
      category: 'エネルギー'
    },
  ]

  const sortedBids = useMemo(() => {
    return [...allBids].sort((a, b) => 
      new Date(b.announcementDate).getTime() - new Date(a.announcementDate).getTime()
    )
  }, [allBids])

  const recentBids = sortedBids.slice(0, 4)
  const recommendedBids = sortedBids.slice(0, 3)
  const favoriteBids = sortedBids.filter(bid => favorites.includes(bid.id))

  const handleFilterChange = (filterType: keyof Filter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleEmailSettingChange = (field: keyof EmailSettings, value: string) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()),
    }))
  }

  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...emailSettings.additionalRecipients]
    newRecipients[index] = value
    setEmailSettings(prev => ({ ...prev, additionalRecipients: newRecipients }))
  }

  const addRecipient = () => {
    if (emailSettings.additionalRecipients.length < 3) {
      setEmailSettings(prev => ({
        ...prev,
        additionalRecipients: [...prev.additionalRecipients, ''],
      }))
    }
  }

  const removeRecipient = (index: number) => {
    setEmailSettings(prev => ({
      ...prev,
      additionalRecipients: prev.additionalRecipients.filter((_, i) => i !== index),
    }))
  }

  const handleEmailSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email settings submitted:', emailSettings)
  }

  const toggleFavorite = (bidId: number) => {
    setFavorites(prev => 
      prev.includes(bidId) 
        ? prev.filter(id => id !== bidId)
        : [...prev, bidId]
    )
  }

  const filteredBids = sortedBids.filter(bid => {
    const matchesKeyword = !filters.keyword || 
      bid.title.toLowerCase().includes(filters.keyword.toLowerCase())
    const matchesProject = !filters.projectName || 
      bid.title.toLowerCase().includes(filters.projectName.toLowerCase())
    const matchesOrganization = !filters.organization || 
      bid.agency.toLowerCase().includes(filters.organization.toLowerCase())
    const matchesRegion = !filters.region || 
      bid.region.toLowerCase().includes(filters.region.toLowerCase())
    
    return matchesKeyword && matchesProject && matchesOrganization && matchesRegion
  })

  const renderBidList = (bids: Bid[]) => (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>公示日</TableHead>
            <TableHead>案件名</TableHead>
            <TableHead>組織名</TableHead>
            <TableHead>地域</TableHead>
            <TableHead>締切</TableHead>
            <TableHead>カテゴリー</TableHead>
            <TableHead>お気に入り</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell>{bid.announcementDate}</TableCell>
              <TableCell>{bid.title}</TableCell>
              <TableCell>{bid.agency}</TableCell>
              <TableCell>{bid.region}</TableCell>
              <TableCell>{bid.deadline}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    bid.category === 'AI' && "bg-blue-500",
                    bid.category === 'IT' && "bg-purple-500",
                    bid.category === '環境' && "bg-green-500",
                    bid.category === '土木' && "bg-orange-500",
                    bid.category === 'エネルギー' && "bg-yellow-500"
                  )}
                >
                  {bid.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(bid.id)}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      favorites.includes(bid.id) ? "fill-yellow-400" : "fill-none"
                    )}
                  />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" className="hover:bg-transparent hover:underline">
                  詳細を見る
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <div className="p-4">
          <h1 className="text-xl font-semibold">AI入札情報</h1>
        </div>
        <nav className="space-y-1">
          <a
            href="#"
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium",
              activeTab === 'dashboard'
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab('dashboard')}
          >
            ダッシュボード
          </a>
          <a
            href="#"
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium",
              activeTab === 'bidList'
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab('bidList')}
          >
            入札一覧
          </a>
          <a
            href="#"
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium",
              activeTab === 'favorites'
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab('favorites')}
          >
            お気に入り
          </a>
          <a
            href="#"
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium",
              activeTab === 'emailSettings'
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab('emailSettings')}
          >
            Eメール設定
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <header className="border-b bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h2 className="text-lg font-medium">
              {activeTab === 'dashboard' && 'ダッシュボード'}
              {activeTab === 'bidList' && '入札一覧'}
              {activeTab === 'favorites' && 'お気に入り'}
              {activeTab === 'emailSettings' && 'Eメール設定'}
            </h2>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="入札情報を検索..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      フィルター
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-medium">カテゴリー</h4>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox id={`category-${category}`} />
                              <Label htmlFor={`category-${category}`}>{category}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium">地域</h4>
                        <div className="space-y-2">
                          {regions.map(region => (
                            <div key={region} className="flex items-center space-x-2">
                              <Checkbox id={`region-${region}`} />
                              <Label htmlFor={`region-${region}`}>{region}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium">組織</h4>
                        <div className="space-y-2">
                          {agencies.map(agency => (
                            <div key={agency} className="flex items-center space-x-2">
                              <Checkbox id={`agency-${agency}`} />
                              <Label htmlFor={`agency-${agency}`}>{agency}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>最近の入札情報</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBids.map((bid) => (
                        <div
                          key={bid.id}
                          className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <h3 className="font-medium">{bid.title}</h3>
                            <p className="text-sm text-gray-500">
                              {bid.agency} - 締切: {bid.deadline}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={cn(
                                "ml-2",
                                bid.category === 'AI' && "bg-blue-500",
                                bid.category === 'IT' && "bg-purple-500",
                                bid.category === '環境' && "bg-green-500",
                                bid.category === '土木' && "bg-orange-500",
                                bid.category === 'エネルギー' && "bg-yellow-500"
                              )}
                            >
                              {bid.category}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(bid.id)}
                            >
                              <Star
                                className={cn(
                                  "h-4 w-4",
                                  favorites.includes(bid.id) ? "fill-yellow-400" : "fill-none"
                                )}
                              />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>おすすめの入札案件</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendedBids.map((bid) => (
                        <div
                          key={bid.id}
                          className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <h3 className="font-medium">{bid.title}</h3>
                            <p className="text-sm text-gray-500">
                              {bid.agency} - 締切: {bid.deadline}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={cn(
                                "ml-2",
                                bid.category === 'AI' && "bg-blue-500",
                                bid.category === 'IT' && "bg-purple-500",
                                bid.category === '環境' && "bg-green-500",
                                bid.category === '土木' && "bg-orange-500",
                                bid.category === 'エネルギー' && "bg-yellow-500"
                              )}
                            >
                              {bid.category}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(bid.id)}
                            >
                              <Star
                                className={cn(
                                  "h-4 w-4",
                                  favorites.includes(bid.id) ? "fill-yellow-400" : "fill-none"
                                )}
                              />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'bidList' && (
            <>
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="キーワードで検索..."
                    className="pl-10"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  />
                </div>
                <Input
                  type="search"
                  placeholder="案件名で検索..."
                  value={filters.projectName}
                  onChange={(e) => handleFilterChange('projectName', e.target.value)}
                />
                <Input
                  type="search"
                  placeholder="組織名で検索..."
                  value={filters.organization}
                  onChange={(e) => handleFilterChange('organization', e.target.value)}
                />
                <Input
                  type="search"
                  placeholder="地域で検索..."
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                />
              </div>
              {renderBidList(filteredBids)}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              <h3 className="text-xl font-semibold mb-4">お気に入りの入札案件</h3>
              {favoriteBids.length > 0 ? (
                renderBidList(favoriteBids)
              ) : (
                <p>お気に入りの入札案件はありません。</p>
              )}
            </>
          )}

          {activeTab === 'emailSettings' && (
            <form onSubmit={handleEmailSettingsSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keywords">キーワード（カンマ区切り）</Label>
                  <Input
                    id="keywords"
                    value={emailSettings.keywords.join(', ')}
                    onChange={(e) => handleEmailSettingChange('keywords', e.target.value)}
                    placeholder="例: AI, クラウド, セキュリティ"
                    className="h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="projectNames">案件名（カンマ区切り）</Label>
                  <Input
                    id="projectNames"
                    value={emailSettings.projectNames.join(', ')}
                    onChange={(e) => handleEmailSettingChange('projectNames', e.target.value)}
                    placeholder="例: システム開発, インフラ構築"
                    className="h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="organizations">組織名（カンマ区切り）</Label>
                  <Input
                    id="organizations"
                    value={emailSettings.organizations.join(', ')}
                    onChange={(e) => handleEmailSettingChange('organizations', e.target.value)}
                    placeholder="例: 経済産業省, 総務省, 東京都"
                    className="h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="regions">地域（カンマ区切り）</Label>
                  <Input
                    id="regions"
                    value={emailSettings.regions.join(', ')}
                    onChange={(e) => handleEmailSettingChange('regions', e.target.value)}
                    placeholder="例: 東京都, 大阪府, 愛知県"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>追加の受信者（最大3名）</Label>
                {emailSettings.additionalRecipients.map((recipient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="email"
                      value={recipient}
                      onChange={(e) => handleRecipientChange(index, e.target.value)}
                      placeholder="example@example.com"
                      className="h-10"
                    />
                    {index === emailSettings.additionalRecipients.length - 1 && index < 2 && (
                      <Button type="button" variant="outline" size="icon" onClick={addRecipient}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    {index > 0 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeRecipient(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  checked={emailSettings.enabled}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enabled: checked }))}
                />
                <Label htmlFor="email-notifications">Eメール通知を有効にする</Label>
              </div>

              <p className="text-sm text-gray-500">
                設定した条件に該当する最新の入札案件情報が平日朝8時に送信されます。
              </p>

              <Button type="submit">設定を保存</Button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}