import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Users, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApi } from '@/hooks/useApi';
import { courtService } from '@/services/courtService';
import { useToast } from '@/components/ui/use-toast';

const CourtsList = ({ onCourtSelect, showAddButton = false, onAddCourt }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    surface: '',
    minPrice: '',
    maxPrice: '',
    isFeatured: '',
    page: 1,
    limit: 12
  });

  const { data, loading, error, execute } = useApi(
    () => courtService.getCourts(filters),
    [filters],
    false
  );

  const { toast } = useToast();

  // Load courts when component mounts or filters change
  useEffect(() => {
    execute();
  }, [execute]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    execute();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      surface: '',
      minPrice: '',
      maxPrice: '',
      isFeatured: '',
      page: 1,
      limit: 12
    });
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Error loading courts: {error}</p>
        <Button onClick={() => execute()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const courts = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courts by name or location..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Court Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Indoor">Indoor</SelectItem>
                <SelectItem value="Outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.surface} onValueChange={(value) => handleFilterChange('surface', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Surface" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Surfaces</SelectItem>
                <SelectItem value="Synthetic">Synthetic</SelectItem>
                <SelectItem value="Clay">Clay</SelectItem>
                <SelectItem value="Grass">Grass</SelectItem>
                <SelectItem value="Concrete">Concrete</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />

            <Input
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
            {showAddButton && (
              <Button
                onClick={onAddCourt}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Court
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Courts Grid */}
      {courts.length === 0 ? (
        <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
          <p className="text-gray-400 text-lg">No courts found matching your criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <motion.div
              key={court.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => onCourtSelect && onCourtSelect(court)}
              >
                {court.images && court.images.length > 0 && (
                  <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <img
                      src={court.images[0]}
                      alt={court.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white truncate">{court.name}</h3>
                    {court.isFeatured && (
                      <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{court.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{court.type} • {court.surface}</span>
                    </div>

                    {court.rating && (
                      <div className="flex items-center text-gray-300">
                        <Star className="h-4 w-4 mr-2 text-yellow-400" />
                        <span className="text-sm">
                          {court.rating.average} ({court.rating.count} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      ₨{court.pricePerHour?.toLocaleString()}/hour
                    </div>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCourtSelect && onCourtSelect(court);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleFilterChange('page', pagination.current - 1)}
            disabled={pagination.current <= 1}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Previous
          </Button>
          
          <span className="text-white px-4">
            Page {pagination.current} of {pagination.pages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => handleFilterChange('page', pagination.current + 1)}
            disabled={pagination.current >= pagination.pages}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourtsList;
